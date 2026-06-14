BEGIN;

INSERT INTO document_templates (id, name, document, created_at, updated_at)
VALUES (
    nextval('template_seq'),
    'Contrato de Empréstimo Pessoal',
    '{
  "components": [
    {
      "type": "HEADER",
      "border": true,
      "components": [
        {
          "type": "PARAGRAPH",
          "alignment": "CENTER",
          "runs": [
            { "text": "{{nome_instituicao}}", "marks": ["BOLD"], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "CENTER",
          "runs": [
            { "text": "CNPJ: {{cnpj_instituicao}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "CENTER",
          "runs": [
            { "text": "{{endereco_instituicao}}", "marks": [], "loopRun": null }
          ]
        }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "TITLE",
      "alignment": "CENTER",
      "runs": [
        { "text": "CONTRATO DE EMPRÉSTIMO PESSOAL", "marks": ["BOLD"], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "CENTER",
      "runs": [
        { "text": "Nº {{numero_contrato}}", "marks": ["BOLD"], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Pelo presente instrumento particular, as partes abaixo identificadas celebram o presente Contrato de Empréstimo Pessoal, que se regerá pelas cláusulas e condições seguintes:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [1],
      "runs": [
        { "text": "DAS PARTES", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [1, 1],
      "runs": [
        { "text": "CREDOR", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Razão Social: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{nome_instituicao}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "CNPJ: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{cnpj_instituicao}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Endereço: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{endereco_instituicao}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Representante Legal: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{representante_credor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 8
    },
    {
      "type": "CLAUSE",
      "number": [1, 2],
      "runs": [
        { "text": "DEVEDOR", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Nome Completo: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{nome_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CONDITIONAL",
      "variable": "tipo_pessoa",
      "value": "PF",
      "components": [
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "CPF: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{documento_devedor}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "RG: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{rg_devedor}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "Estado Civil: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{estado_civil_devedor}}", "marks": [], "loopRun": null }
          ]
        }
      ]
    },
    {
      "type": "CONDITIONAL",
      "variable": "tipo_pessoa",
      "value": "PJ",
      "components": [
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "CNPJ: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{documento_devedor}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "Representante Legal: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{representante_devedor}}", "marks": [], "loopRun": null }
          ]
        }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Endereço: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{endereco_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Cidade/UF: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{cidade_devedor}}/{{uf_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "CEP: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{cep_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Telefone: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{telefone_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "E-mail: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{email_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [2],
      "runs": [
        { "text": "DO OBJETO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [2, 1],
      "runs": [
        { "text": "DO VALOR DO EMPRÉSTIMO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O CREDOR concede ao DEVEDOR, a título de empréstimo, a quantia de ", "marks": [], "loopRun": null },
        { "text": "{{valor_emprestimo_extenso}} ({{valor_emprestimo}})", "marks": ["BOLD"], "loopRun": null },
        { "text": ", doravante denominado \"Valor Principal\", que será creditado na conta bancária indicada pelo DEVEDOR, conforme dados a seguir:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Banco: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{banco_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Agência: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{agencia_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "marginLeft": 24,
      "runs": [
        { "text": "Conta Corrente: ", "marks": ["BOLD"], "loopRun": null },
        { "text": "{{conta_devedor}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [3],
      "runs": [
        { "text": "DO PRAZO E DAS CONDIÇÕES DE PAGAMENTO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [3, 1],
      "runs": [
        { "text": "DO PRAZO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O empréstimo terá prazo de ", "marks": [], "loopRun": null },
        { "text": "{{prazo_meses}} ({{prazo_meses_extenso}}) meses", "marks": ["BOLD"], "loopRun": null },
        { "text": ", com início em ", "marks": [], "loopRun": null },
        { "text": "{{data_inicio}}", "marks": ["BOLD"], "loopRun": null },
        { "text": " e vencimento final em ", "marks": [], "loopRun": null },
        { "text": "{{data_vencimento_final}}", "marks": ["BOLD"], "loopRun": null },
        { "text": ".", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [3, 2],
      "runs": [
        { "text": "DAS PARCELAS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O DEVEDOR se obriga a pagar ao CREDOR o valor total do empréstimo acrescido de juros em ", "marks": [], "loopRun": null },
        { "text": "{{prazo_meses}} ({{prazo_meses_extenso}}) parcelas mensais e consecutivas", "marks": ["BOLD"], "loopRun": null },
        { "text": " no valor de ", "marks": [], "loopRun": null },
        { "text": "{{valor_parcela}}", "marks": ["BOLD"], "loopRun": null },
        { "text": " cada, vencendo-se a primeira em ", "marks": [], "loopRun": null },
        { "text": "{{data_primeiro_vencimento}}", "marks": ["BOLD"], "loopRun": null },
        { "text": " e as demais no mesmo dia dos meses subsequentes.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [3, 3],
      "runs": [
        { "text": "DA FORMA DE PAGAMENTO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Os pagamentos deverão ser realizados mediante ", "marks": [], "loopRun": null },
        { "text": "{{forma_pagamento}}", "marks": ["BOLD"], "loopRun": null },
        { "text": ", até o dia do vencimento de cada parcela, não sendo admitido qualquer desconto por antecipação salvo expressa autorização do CREDOR.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [4],
      "runs": [
        { "text": "DOS JUROS E ENCARGOS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [4, 1],
      "runs": [
        { "text": "DOS JUROS REMUNERATÓRIOS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Sobre o Valor Principal incidirão juros remuneratórios à taxa de ", "marks": [], "loopRun": null },
        { "text": "{{taxa_juros_mensal}}% ao mês ({{taxa_juros_anual}}% ao ano)", "marks": ["BOLD"], "loopRun": null },
        { "text": ", calculados pelo sistema ", "marks": [], "loopRun": null },
        { "text": "{{sistema_amortizacao}}", "marks": ["BOLD"], "loopRun": null },
        { "text": ".", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [4, 2],
      "runs": [
        { "text": "DA MORA E MULTA", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Em caso de atraso no pagamento de qualquer parcela, incidirão sobre o valor em atraso: (i) multa moratória de ", "marks": [], "loopRun": null },
        { "text": "{{multa_mora}}%", "marks": ["BOLD"], "loopRun": null },
        { "text": "; (ii) juros de mora de ", "marks": [], "loopRun": null },
        { "text": "{{juros_mora}}% ao mês", "marks": ["BOLD"], "loopRun": null },
        { "text": "; e (iii) correção monetária pelo ", "marks": [], "loopRun": null },
        { "text": "{{indice_correcao}}", "marks": ["BOLD"], "loopRun": null },
        { "text": ".", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [4, 3],
      "runs": [
        { "text": "DO IOF", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Sobre a operação incidirá o Imposto sobre Operações Financeiras (IOF) à alíquota legal vigente, no valor de ", "marks": [], "loopRun": null },
        { "text": "{{valor_iof}}", "marks": ["BOLD"], "loopRun": null },
        { "text": ", que será debitado do valor líquido liberado ao DEVEDOR.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [5],
      "runs": [
        { "text": "DO CUSTO EFETIVO TOTAL", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O Custo Efetivo Total (CET) da presente operação é de ", "marks": [], "loopRun": null },
        { "text": "{{cet_mensal}}% ao mês ({{cet_anual}}% ao ano)", "marks": ["BOLD"], "loopRun": null },
        { "text": ", conforme demonstrativo entregue ao DEVEDOR nesta data.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [6],
      "runs": [
        { "text": "DAS GARANTIAS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [6, 1],
      "runs": [
        { "text": "DOS AVALISTAS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Como garantia da presente operação, o DEVEDOR apresenta os seguintes avalistas:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LOOP",
      "items": [],
      "components": [
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "Nome: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{nome_avalista}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "CPF: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{cpf_avalista}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "RG: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{rg_avalista}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "PARAGRAPH",
          "alignment": "LEFT",
          "marginLeft": 24,
          "runs": [
            { "text": "Endereço: ", "marks": ["BOLD"], "loopRun": null },
            { "text": "{{endereco_avalista}}", "marks": [], "loopRun": null }
          ]
        },
        {
          "type": "LINE_BREAK",
          "points": 6
        }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [6, 2],
      "runs": [
        { "text": "DA EXTENSÃO DA GARANTIA", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Os avalistas acima qualificados respondem solidariamente com o DEVEDOR pelo cumprimento de todas as obrigações previstas neste instrumento, incluindo principal, juros, multas, encargos e demais acessórios.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [7],
      "runs": [
        { "text": "DO VENCIMENTO ANTECIPADO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O CREDOR poderá declarar o vencimento antecipado de todas as obrigações do DEVEDOR, independentemente de aviso ou notificação, nas seguintes hipóteses:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "UNORDERED_LIST",
      "elements": [
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Inadimplência de qualquer parcela por prazo superior a 3 (três) dias corridos;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Falecimento, interdição, insolvência, pedido de recuperação judicial ou falência do DEVEDOR ou de qualquer dos avalistas;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Protesto de títulos contra o DEVEDOR ou avalistas em valor superior a {{valor_limite_protesto}};", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Prestação de informações falsas ou inexatas ao CREDOR;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Alienação ou oneração dos bens dados em garantia sem anuência prévia do CREDOR.", "marks": [], "loopRun": null }]
        }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [8],
      "runs": [
        { "text": "DAS OBRIGAÇÕES DO DEVEDOR", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Durante a vigência deste contrato, o DEVEDOR se obriga a:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "UNORDERED_LIST",
      "elements": [
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Efetuar pontualmente o pagamento das parcelas nas datas estabelecidas;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Comunicar imediatamente ao CREDOR qualquer alteração em seus dados cadastrais;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Não contrair novas dívidas que comprometam sua capacidade de pagamento sem prévia comunicação ao CREDOR;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Apresentar documentação financeira quando solicitado pelo CREDOR;", "marks": [], "loopRun": null }]
        },
        {
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Utilizar os recursos exclusivamente para a finalidade declarada de {{finalidade_emprestimo}}.", "marks": [], "loopRun": null }]
        }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [9],
      "runs": [
        { "text": "DA PORTABILIDADE E QUITAÇÃO ANTECIPADA", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [9, 1],
      "runs": [
        { "text": "DA LIQUIDAÇÃO ANTECIPADA", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O DEVEDOR poderá liquidar antecipadamente o saldo devedor, total ou parcialmente, com redução proporcional dos juros ainda não incorridos, mediante solicitação prévia ao CREDOR com antecedência mínima de ", "marks": [], "loopRun": null },
        { "text": "{{prazo_aviso_quitacao}} dias úteis", "marks": ["BOLD"], "loopRun": null },
        { "text": ".", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [9, 2],
      "runs": [
        { "text": "DA PORTABILIDADE", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "É assegurado ao DEVEDOR o direito à portabilidade desta operação para outra instituição financeira, nos termos da regulamentação do Banco Central do Brasil, sem cobrança de tarifas adicionais.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [10],
      "runs": [
        { "text": "DA CESSÃO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O CREDOR poderá ceder ou transferir os direitos e obrigações decorrentes do presente contrato a terceiros, independentemente de notificação ao DEVEDOR, nos termos do artigo 286 do Código Civil Brasileiro.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [11],
      "runs": [
        { "text": "DO TRATAMENTO DE DADOS PESSOAIS (LGPD)", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD), o CREDOR declara que os dados pessoais coletados nesta operação serão utilizados exclusivamente para:", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "UNORDERED_LIST",
      "elements": [
        {
          "type": "PARAGRAPH",
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Análise de crédito e formalização desta operação;", "marks": [], "loopRun": null }]
        },
        {
          "type": "PARAGRAPH",
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Cumprimento de obrigações legais e regulatórias;", "marks": [], "loopRun": null }]
        },
        {
          "type": "PARAGRAPH",
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Prevenção à fraude e gestão de riscos;", "marks": [], "loopRun": null }]
        },
        {
          "type": "PARAGRAPH",
          "marginLeft": 24,
          "alignment": "LEFT",
          "runs": [{ "text": "Comunicação sobre produtos e serviços, mediante consentimento prévio do titular.", "marks": [], "loopRun": null }]
        }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "CLAUSE",
      "number": [12],
      "runs": [
        { "text": "DAS DISPOSIÇÕES GERAIS", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [12, 1],
      "runs": [
        { "text": "DA LEGISLAÇÃO APLICÁVEL", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "O presente contrato é regido pelas leis da República Federativa do Brasil, em especial pelo Código Civil, pelo Código de Defesa do Consumidor e pelas normas do Conselho Monetário Nacional e do Banco Central do Brasil.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [12, 2],
      "runs": [
        { "text": "DO FORO", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Fica eleito o foro da comarca de ", "marks": [], "loopRun": null },
        { "text": "{{cidade_foro}}/{{uf_foro}}", "marks": ["BOLD"], "loopRun": null },
        { "text": " para dirimir quaisquer controvérsias decorrentes do presente instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "CLAUSE",
      "number": [12, 3],
      "runs": [
        { "text": "DA INTEGRALIDADE", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "PARAGRAPH",
      "alignment": "LEFT",
      "runs": [
        { "text": "Este instrumento representa a totalidade dos acordos entre as partes com relação ao seu objeto, substituindo todas as negociações, entendimentos e acordos anteriores, verbais ou escritos.", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 12
    },
    {
      "type": "PARAGRAPH",
      "alignment": "CENTER",
      "runs": [
        { "text": "{{cidade_foro}}, {{data_assinatura}}", "marks": [], "loopRun": null }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 24
    },
    {
      "type": "SIGNATURE",
      "name": "{{nome_instituicao}}",
      "document": "CNPJ: {{cnpj_instituicao}}"
    },
    {
      "type": "SIGNATURE",
      "name": "{{nome_devedor}}",
      "document": "CPF/CNPJ: {{documento_devedor}}"
    },
    {
      "type": "LOOP",
      "items": [],
      "components": [
        {
          "type": "SIGNATURE",
          "name": "{{nome_avalista}}",
          "document": "CPF: {{cpf_avalista}}"
        }
      ]
    },
    {
      "type": "LINE_BREAK",
      "points": 24
    },
    {
      "type": "PARAGRAPH",
      "alignment": "CENTER",
      "runs": [
        { "text": "Testemunhas:", "marks": ["BOLD"], "loopRun": null }
      ]
    },
    {
      "type": "SIGNATURE",
      "name": "{{nome_testemunha1}}",
      "document": "CPF: {{cpf_testemunha1}}"
    },
    {
      "type": "SIGNATURE",
      "name": "{{nome_testemunha2}}",
      "document": "CPF: {{cpf_testemunha2}}"
    }
  ]
}',
    NOW(),
    NOW()
);

INSERT INTO template_variables (id, template_id, name)
SELECT nextval('template_variable_seq'), currval('template_seq'), v.name
FROM (VALUES
    ('nome_instituicao'),
    ('cnpj_instituicao'),
    ('endereco_instituicao'),
    ('representante_credor'),
    ('numero_contrato'),
    ('nome_devedor'),
    ('tipo_pessoa'),
    ('documento_devedor'),
    ('rg_devedor'),
    ('estado_civil_devedor'),
    ('representante_devedor'),
    ('endereco_devedor'),
    ('cidade_devedor'),
    ('uf_devedor'),
    ('cep_devedor'),
    ('telefone_devedor'),
    ('email_devedor'),
    ('valor_emprestimo'),
    ('valor_emprestimo_extenso'),
    ('banco_devedor'),
    ('agencia_devedor'),
    ('conta_devedor'),
    ('prazo_meses'),
    ('prazo_meses_extenso'),
    ('data_inicio'),
    ('data_vencimento_final'),
    ('valor_parcela'),
    ('data_primeiro_vencimento'),
    ('forma_pagamento'),
    ('taxa_juros_mensal'),
    ('taxa_juros_anual'),
    ('sistema_amortizacao'),
    ('multa_mora'),
    ('juros_mora'),
    ('indice_correcao'),
    ('valor_iof'),
    ('cet_mensal'),
    ('cet_anual'),
    ('nome_avalista'),
    ('cpf_avalista'),
    ('rg_avalista'),
    ('endereco_avalista'),
    ('valor_limite_protesto'),
    ('finalidade_emprestimo'),
    ('prazo_aviso_quitacao'),
    ('cidade_foro'),
    ('uf_foro'),
    ('data_assinatura'),
    ('nome_testemunha1'),
    ('cpf_testemunha1'),
    ('nome_testemunha2'),
    ('cpf_testemunha2')
) AS v(name);

COMMIT;