module.exports = (prefix, NomeDoBot, NickDono, dataFormatada, horaFormatada) => {
return `
꒰ঌ࿔────⊹˖₊˚⊹⋆────⋆
        𝙼𝙴𝙽𝚄 𝙳𝙾𝙽𝙾
⋆────⋆⊹˚₊˖⊹────࿔໒꒱

╭─⊹˖₊˚ 𝙸𝙽𝙵𝙾 𝙳𝙾 𝙱𝙾𝚃
│
│ ☆‧͙⁺˚*･ 𝙱𝙾𝚃: ${NomeDoBot}
│ ☆‧͙⁺˚*･ 𝙳𝙾𝙽𝙾: ${NickDono}
│ ☆‧͙⁺˚*･ 𝙳𝙰𝚃𝙰: ${dataFormatada}
│ ☆‧͙⁺˚*･ 𝙷𝙾𝚁𝙰: ${horaFormatada}
│ ☆‧͙⁺˚*･ 𝙿𝚁𝙴𝙵𝙸𝚇𝙾: ${prefix}
│
╰──────────────⊹

꒰ঌ࿔────⊹˖₊˚⊹⋆────⋆
        𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝙼𝙴𝙽𝚃𝙾
⋆────⋆⊹˚₊˖⊹────࿔໒꒱

╭─⊹˖₊˚ 𝙿𝙰𝙸𝙽𝙴𝙸𝚂 𝙴 𝚂𝚃𝙰𝚃𝚄𝚂
│
│ ☆‧͙⁺˚*･ ${prefix}painel
│ ☆‧͙⁺˚*･ ${prefix}painelgp
│ ☆‧͙⁺˚*･ ${prefix}relatorio
│ ☆‧͙⁺˚*･ ${prefix}statusbot
│ ☆‧͙⁺˚*･ ${prefix}diagnostico
│ ☆‧͙⁺˚*･ ${prefix}logs
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙳𝙾𝙽𝙾 𝙴 𝙸𝙳𝚂
│
│ ☆‧͙⁺˚*･ ${prefix}setdono número/@user
│ ☆‧͙⁺˚*･ ${prefix}setdonoid @user
│ ☆‧͙⁺˚*･ ${prefix}addsubdono número/@user
│ ☆‧͙⁺˚*･ ${prefix}rmsubdono número/@user
│ ☆‧͙⁺˚*･ ${prefix}listdonos
│ ☆‧͙⁺˚*･ ${prefix}setnickdono nome
│ ☆‧͙⁺˚*･ ${prefix}meuid
│ ☆‧͙⁺˚*･ ${prefix}recdono key
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙲̧𝙾̃𝙴𝚂
│
│ ☆‧͙⁺˚*･ ${prefix}setprefix novo_prefixo
│ ☆‧͙⁺˚*･ ${prefix}setnomebot novo_nome
│ ☆‧͙⁺˚*･ ${prefix}setpix chave
│ ☆‧͙⁺˚*･ ${prefix}setapitoken token
│ ☆‧͙⁺˚*･ ${prefix}reloadconfig
│ ☆‧͙⁺˚*･ ${prefix}verconfig
│ ☆‧͙⁺˚*･ ${prefix}channel on/off
│ ☆‧͙⁺˚*･ ${prefix}channel jid
│ ☆‧͙⁺˚*･ ${prefix}channel url
│ ☆‧͙⁺˚*･ ${prefix}channel nome
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁𝙴𝚂
│
│ ☆‧͙⁺˚*･ ${prefix}criador
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾
│
│ ☆‧͙⁺˚*･ ${prefix}update
│ ☆‧͙⁺˚*･ ${prefix}update force
│ ☆‧͙⁺˚*･ ${prefix}rollback
│ ☆‧͙⁺˚*･ ${prefix}backup
│ ☆‧͙⁺˚*･ ${prefix}reiniciar
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙴 𝙲𝙻𝙸𝙴𝙽𝚃𝙴𝚂
|
│ ☆‧͙⁺˚*･ ${prefix}listaaluguel
│ ☆‧͙⁺˚*･ ${prefix}rmaluguel
│ ☆‧͙⁺˚*･ ${prefix}rg_aluguel
│ ☆‧͙⁺˚*･ ${prefix}aluguel_global
│ ☆‧͙⁺˚*･ ${prefix}modoaluguel on/off/status
│ ☆‧͙⁺˚*･ ${prefix}clientes
│ ☆‧͙⁺˚*･ ${prefix}expirados
│ ☆‧͙⁺˚*･ ${prefix}autocobranca on 3
│ ☆‧͙⁺˚*･ ${prefix}planos
│ ☆‧͙⁺˚*･ ${prefix}planos set texto
│ ☆‧͙⁺˚*･ ${prefix}fazerpix
│ ☆‧͙⁺˚*･ ${prefix}contrato
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙱𝙻𝙰𝙲𝙺𝙻𝙸𝚂𝚃
│
│ ☆‧͙⁺˚*･ ${prefix}blacklist número motivo
│ ☆‧͙⁺˚*･ ${prefix}blacklist list
│ ☆‧͙⁺˚*･ ${prefix}unblacklist número
│
╰──────────────⊹

╭─⊹˖₊˚ 𝙲𝙾𝙼𝚄𝙽𝙸𝙲𝙰𝙳𝙾𝚂
│
│ ☆‧͙⁺˚*･ ${prefix}broadcast mensagem
│ ☆‧͙⁺˚*･ ${prefix}novidades
│ ☆‧͙⁺˚*･ ${prefix}novidades add texto
│ ☆‧͙⁺˚*･ ${prefix}novidades clear
│
╰──────────────⊹

╭─⊹˖₊˚ 𝚂𝚄𝙿𝙾𝚁𝚃𝙴
│
│ ☆‧͙⁺˚*･ ${prefix}ticket list
│ ☆‧͙⁺˚*･ ${prefix}ticket responder ID msg
│ ☆‧͙⁺˚*･ ${prefix}ticket fechar ID
│ ☆‧͙⁺˚*･ ${prefix}avaliar 5 comentário
│ ☆‧͙⁺˚*･ ${prefix}suporte mensagem
│ ☆‧͙⁺˚*･ ${prefix}sugestao mensagem
│
╰──────────────⊹

꒰ঌ࿔────⊹˖₊˚⊹⋆────⋆
  𝙼𝙴𝙽𝚄 𝚁𝙴𝚂𝚃𝚁𝙸𝚃𝙾 𝙰𝙾 𝙳𝙾𝙽𝙾
⋆────⋆⊹˚₊˖⊹────࿔໒꒱
`;
           }
