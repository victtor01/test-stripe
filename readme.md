
## 💸 Integração Stripe (Ambiente Local)

Para testar o recebimento de Webhooks (confirmação de onboarding, pagamentos PIX) em `localhost`, é necessário utilizar a Stripe CLI.

### 1. Pré-requisitos
Certifique-se de estar logado na CLI:
```bash
stripe login

```
### 2. Iniciar o Tunnel (Listener)

Mantenha este comando rodando em um terminal dedicado. Ele vai capturar os eventos da nuvem e "empurrar" para o seu backend:

Bash

```
stripe listen --forward-to localhost:8080/api/webhooks/stripe

```
### 3. Configurar Assinatura (Importante!)

Assim que o comando acima iniciar, ele exibirá uma chave no terminal: 
`> Ready! Your webhook signing secret is whsec_...`

1. Copie o valor que começa com `whsec_`.

2. Atualize o seu arquivo `.env`:

Snippet de código

```
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_aqui

```

*(Sem isso, o backend rejeitará os eventos com erro de assinatura).*

---
### 🧪 Comandos Úteis para Teste

Em **outro terminal**, você pode disparar eventos simulados:

Bash

```
# Simular atualização de conta (Onboarding completo)
stripe trigger account.updated

# Simular pagamento com sucesso
stripe trigger payment_intent.succeeded

```