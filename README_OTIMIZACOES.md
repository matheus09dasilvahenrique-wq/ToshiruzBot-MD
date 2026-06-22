# Toshiruz Bot - versão otimizada

## O que foi alterado

### Botão/encaminhamento de canal
Agora o canal é configurável em `./dono/configs.json`:

```json
"channel": {
  "ativo": true,
  "nome": "Toshiruz-Bot",
  "jid": "120363407261218149@newsletter",
  "url": "https://whatsapp.com/channel/SEU_CANAL"
}
```

O Baileys costuma funcionar melhor com o `jid` terminado em `@newsletter`. A URL fica salva para referência, mas nem sempre substitui o JID real do canal.

Comandos do dono:

```txt
!channel on
!channel off
!channel jid 120363XXXXXXXX@newsletter
!channel url https://whatsapp.com/channel/SEU_CANAL
!channel nome Nome Do Canal
```

Também funcionam com `!canal`.

### Otimizações aplicadas no index.js

- Cache de leitura para arquivos JSON.
- Cache de `groupMetadata`, reduzindo chamadas pesadas em mensagens de grupo.
- Limpeza automática do cache de metadata quando membros entram/saem.
- Mensagens marcadas como lidas sem bloquear o processamento.
- `reply()` mais resistente: se falhar com `quoted`, tenta enviar sem `quoted`.
- `default` manteve a mensagem decorada original.
- Inicialização de saldo/gold movida para depois da checagem de comando, evitando escrita em toda mensagem comum.
- Correção de `reagir()` para aceitar tanto `reagir('✅')` quanto chamadas antigas `reagir(from, '✅')`.
- Compatibilidade com comandos que usam `m.chat`, `m.reply`, `m.quoted` e `text`.
- Remoção de atrasos artificiais nos menus principais.

## O que não foi incluído neste ZIP

- `node_modules`: instale com `npm install`.
- Sessões/QR em `media/qr-code`: mantive a pasta vazia por segurança. Copie sua sessão antiga manualmente se quiser reaproveitar login.

## Como rodar

```bash
npm install
npm start
```

Antes de substituir em produção, faça backup do bot atual.
