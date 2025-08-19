# 🚀 Instruções para Upload na Hostinger

## 📁 **Arquivos para Upload**

### **1. Pasta `.next` (Build de Produção)**

- Esta pasta contém o código otimizado para produção
- **Localização**: `/.next/` (raiz do projeto após build)

### **2. Pasta `public`**

- Contém arquivos estáticos (imagens, manifest, service worker)
- **Arquivos incluídos**:
  - `ozemfirelogo.png.png`
  - `simbolo.png`
  - `body.webp`
  - `manifest.json`
  - `sw.js`
  - `browserconfig.xml`
  - `robots.txt`
  - `.htaccess`

### **3. Arquivo `package.json`**

- Configurações do projeto

## 📤 **Passos para Upload**

### **Passo 1: Acessar o Painel da Hostinger**

1. Faça login no painel da Hostinger
2. Acesse o **File Manager** ou **Gerenciador de Arquivos**

### **Passo 2: Navegar para a Pasta do Site**

1. Vá para a pasta `public_html` (ou pasta raiz do seu domínio)
2. **IMPORTANTE**: Faça backup da pasta atual se existir

### **Passo 3: Upload dos Arquivos**

1. **Faça upload da pasta `.next`** para a raiz
2. **Faça upload da pasta `public`** para a raiz
3. **Faça upload do `package.json`** para a raiz

### **Passo 4: Configurar o .htaccess**

1. Certifique-se de que o arquivo `.htaccess` está na raiz
2. Se não estiver, faça upload dele

## ⚙️ **Configurações Adicionais**

### **1. Configurar Node.js (se necessário)**

- Acesse **Advanced** > **Node.js** no painel da Hostinger
- Configure a versão do Node.js para **18.x** ou superior
- Defina o **Startup File** como: `server.js`

### **2. Configurar Domínio**

- Certifique-se de que o domínio está apontando para a pasta correta
- Configure SSL se disponível

## 🔧 **Arquivos de Configuração**

### **`.htaccess`**

- Configurações de cache para PWA
- Compressão GZIP
- Headers de segurança
- Redirecionamentos para SPA

### **`manifest.json`**

- Configurações PWA
- Ícones e cores do tema
- Shortcuts para funcionalidades

### **`sw.js`**

- Service Worker para funcionalidade offline
- Cache de recursos estáticos

## 📱 **Funcionalidades PWA**

### **Instalação no Celular**

- Usuários verão banner "Adicionar à Tela Inicial"
- App será instalado como app nativo
- Funcionará offline

### **Aparência de App**

- Tela cheia sem barra de navegador
- Tema rosa feminino
- Ícones nativos do sistema

## 🚨 **Problemas Comuns e Soluções**

### **1. Erro 500**

- Verifique se o `.htaccess` está correto
- Confirme se todos os arquivos foram uploadados

### **2. Página em Branco**

- Verifique se a pasta `.next` está na raiz
- Confirme se o `package.json` está presente

### **3. Imagens não Carregam**

- Verifique se a pasta `public` está na raiz
- Confirme se o `.htaccess` está configurado

### **4. PWA não Funciona**

- Verifique se o `manifest.json` está acessível
- Confirme se o `sw.js` está na raiz

## 📊 **Verificação Pós-Upload**

### **1. Testar Funcionalidades**

- [ ] Página inicial carrega
- [ ] Formulário funciona
- [ ] IA gera respostas
- [ ] Página de resultado exibe dados
- [ ] Botão de impressão funciona

### **2. Testar PWA**

- [ ] Banner de instalação aparece
- [ ] App instala no celular
- [ ] Funciona offline
- [ ] Ícones aparecem corretos

### **3. Testar Performance**

- [ ] Carregamento rápido
- [ ] Imagens otimizadas
- [ ] Cache funcionando
- [ ] Compressão GZIP ativa

## 🎯 **URLs de Teste**

- **Página Inicial**: `https://seudominio.com/`
- **Formulário**: `https://seudominio.com/form`
- **Manifest**: `https://seudominio.com/manifest.json`
- **Service Worker**: `https://seudominio.com/sw.js`

## 📞 **Suporte**

Se encontrar problemas:

1. Verifique os logs de erro da Hostinger
2. Confirme se todos os arquivos estão na pasta correta
3. Teste em diferentes navegadores
4. Verifique o console do navegador para erros JavaScript

---

**🎉 Seu Ozemfire estará funcionando perfeitamente na Hostinger!**
