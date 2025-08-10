# api/main.py
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

@app.get("/resumo/{file_name}")
async def get_summary_file(file_name: str):
    file_path = DATA_DIR / f"{file_name}.json"
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Arquivo de resumo não encontrado")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)

CDAS_FILE_PATH = DATA_DIR / "cdas.json"
cdas_data = []
if CDAS_FILE_PATH.is_file():
    with open(CDAS_FILE_PATH, "r", encoding="utf-8") as f:
        original_data = json.load(f)
        for item in original_data:
            item['numero_cda'] = item.pop('numCDA')
            item['valor_principal'] = 0
            item['saldo'] = item.pop('valor_saldo_atualizado')
            item['ano_idade'] = item.pop('qtde_anos_idade_cda')
            item['data_inscricao'] = "N/A"
        cdas_data = original_data

SITUACAO_MAP = {
    -1: "Cancelada",
    0: "Em cobrança",
    1: "Quitada"
}

# Modelo Pydantic
class CDAItem(BaseModel):
    ano_idade: int
    numero_cda: str
    data_inscricao: str
    valor_principal: float
    saldo: float
    agrupamento_situacao: int
    situacao_legivel: str

# Endpoint de busca
@app.get("/cda/search", response_model=List[CDAItem])
async def search_cdas(
    ano: Optional[int] = None,
    saldo_min: Optional[float] = None,
    saldo_max: Optional[float] = None,
    situacao: Optional[int] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "asc"
):
    results = cdas_data
    if ano is not None:
        results = [item for item in results if item.get("ano_idade") == ano]
    if saldo_min is not None:
        results = [item for item in results if item.get("saldo", 0) >= saldo_min]
    if saldo_max is not None:
        results = [item for item in results if item.get("saldo", 0) <= saldo_max]
    if situacao is not None:
        results = [item for item in results if item.get("agrupamento_situacao") == situacao]
    if sort_by in ["ano_idade", "saldo"]:
        sort_key = "ano_idade" if sort_by == "ano" else sort_by
        reverse_order = order.lower() == "desc"
        results = sorted(results, key=lambda item: item.get(sort_key, 0), reverse=reverse_order)
    validated_results = []
    for item in results:
        item_data = item.copy()
        item_data["situacao_legivel"] = SITUACAO_MAP.get(item.get("agrupamento_situacao"), "Desconhecida")
        validated_results.append(CDAItem(**item_data))
    return validated_results


ALL_NATUREZAS = ["IPTU", "ISS", "Taxas", "Multas", "ITBI", "Outras"]

@app.get("/cda/{cda_number}/dashboard")
async def get_dashboard_by_cda(cda_number: str):
    target_cda = None
    for cda in cdas_data:
        if cda.get("numero_cda") == cda_number:
            target_cda = cda
            break

    if not target_cda:
        raise HTTPException(status_code=404, detail="CDA não encontrada")

    cda_natureza = target_cda.get("natureza", "Outras")
    cda_saldo = target_cda.get("saldo", 0)
    cda_situacao_code = target_cda.get("agrupamento_situacao")
    cda_situacao_text = SITUACAO_MAP.get(cda_situacao_code, "Desconhecida")
    
    # Extrai o ano de inscrição dos 4 primeiros dígitos do número da CDA
    try:
        cda_ano_inscricao = int(target_cda.get("numero_cda", "0")[0:4])
    except (ValueError, IndexError):
        cda_ano_inscricao = 0 # Fallback caso o número da CDA seja inválido
    
    saldo_cdas = []
    for natureza in ALL_NATUREZAS:
        saldo = cda_saldo if natureza == cda_natureza else 0
        saldo_cdas.append({"name": natureza, "Saldo": saldo})

    quantidade_cdas = []
    for natureza in ALL_NATUREZAS:
        qtd = 1 if natureza == cda_natureza else 0
        quantidade_cdas.append({"name": natureza, "Quantidade": qtd})
        
    # Usa o ano de inscrição
    inscricoes = [{"ano": cda_ano_inscricao, "Quantidade": 1}]

    distribuicao_cdas = []
    for natureza in ALL_NATUREZAS:
        item = {"name": natureza, "Quitada": 0, "Em cobrança": 0, "Cancelada": 0}
        if natureza == cda_natureza:
            if cda_situacao_text == "Quitada":
                item["Quitada"] = 100
            elif cda_situacao_text == "Em cobrança":
                item["Em cobrança"] = 100
            elif cda_situacao_text == "Cancelada":
                item["Cancelada"] = 100
        distribuicao_cdas.append(item)

    dashboard_data = {
        "saldo_cdas": saldo_cdas,
        "quantidade_cdas": quantidade_cdas,
        "inscricoes": inscricoes,
        "distribuicao_cdas": distribuicao_cdas
    }

    return JSONResponse(content=dashboard_data)