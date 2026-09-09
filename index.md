# Introdução ao React

**Disciplina:** Programação Web Full Stack — Engenharia de Software
**Tema da aula:** Fundamentos do React (biblioteca JavaScript para interfaces)

**Referências desta aula:**
- W3Schools React Tutorial — [Introduction](https://www.w3schools.com/react/react_intro.asp), [Get Started](https://www.w3schools.com/react/react_getstarted.asp), [Start a New React App](https://www.w3schools.com/react/react_first_app.asp)
- Documentação oficial — [react.dev/learn](https://react.dev/learn)

---

## 1. Objetivos da aula

Ao final desta aula, o(a) aluno(a) deve ser capaz de:

1. Explicar o que é o React e por que ele é usado no desenvolvimento web moderno.
2. Entender os conceitos de **componente**, **JSX**, **props** e **state**.
3. Criar um projeto React do zero usando o Vite.
4. Construir e renderizar um primeiro componente funcional.

---

## 2. O que é o React?

React é uma **biblioteca JavaScript** de código aberto, mantida pela Meta, usada para construir **interfaces de usuário (UI)**, especialmente para aplicações de página única (*Single Page Applications* — SPA).

Diferente de um framework completo, o React cuida apenas da **camada de visualização** (a "V" do padrão MVC). Ele se integra facilmente com outras bibliotecas (roteamento, gerenciamento de estado global, requisições HTTP), o que o torna flexível para diferentes arquiteturas de projeto.

### Por que o React é tão usado?

| Motivo | Explicação |
|---|---|
| **Componentização** | A interface é dividida em pequenas peças reutilizáveis (componentes), o que organiza e facilita a manutenção do código. |
| **Virtual DOM** | O React mantém uma representação em memória da interface e atualiza o DOM real de forma otimizada, só onde houve mudança. |
| **Declarativo** | Descrevemos *como a interface deve parecer* para cada estado da aplicação, e o React se encarrega de atualizar a tela. |
| **Ecossistema maduro** | Grande comunidade, muitas bibliotecas complementares (React Router, Redux, Zustand, etc.) e forte demanda no mercado de trabalho. |
| **Reutilização entre plataformas** | Conceitos e boa parte do código podem ser aproveitados em React Native para aplicativos mobile. |

### Como o React atualiza a tela (Virtual DOM)

Manipular o DOM real do navegador diretamente é uma operação custosa. O React resolve isso mantendo uma cópia leve da interface em memória (a *Virtual DOM*) e comparando versões antes de tocar o DOM real:

![Diagrama mostrando o fluxo de atualização do React: mudança de estado, recriação da Virtual DOM, comparação (diff) e aplicação apenas das mudanças no DOM real](images/01-virtual-dom.png)

---

## 3. JSX: misturando HTML e JavaScript

**JSX** (*JavaScript XML*) é uma extensão de sintaxe que permite escrever elementos parecidos com HTML dentro do código JavaScript. O navegador não entende JSX diretamente — ferramentas como o **Babel** convertem o JSX em chamadas `React.createElement()` antes da execução.

```jsx
const elemento = <h1>Olá, turma de Full Stack!</h1>;
```

Isso é equivalente, "por baixo dos panos", a:

```js
const elemento = React.createElement('h1', null, 'Olá, turma de Full Stack!');
```

### Regras importantes do JSX

- Todo componente deve retornar **um único elemento raiz** (ou usar um *Fragment* `<>...</>`).
- Atributos HTML usam **camelCase**: `class` vira `className`, `onclick` vira `onClick`.
- Expressões JavaScript são inseridas entre chaves `{ }`:

```jsx
const nome = "Juliana";
const saudacao = <p>Bem-vinda, {nome}!</p>;
```

- Tags devem ser sempre fechadas, inclusive as que não têm par no HTML: `<img />`, `<br />`.

---

## 4. Componentes

Um **componente** é uma função (ou, historicamente, uma classe) que retorna JSX descrevendo um pedaço da interface. É a unidade fundamental de reutilização no React.

```jsx
function BemVindo() {
  return <h2>Bem-vindo(a) à disciplina de Programação Web Full Stack!</h2>;
}

export default BemVindo;
```

Componentes podem ser combinados como peças de Lego, formando uma **árvore de componentes**: um componente pai renderiza outros componentes filhos, passando dados para eles.

### Props e State

- **Props** (*properties*): dados enviados de um componente pai para um componente filho. São **somente leitura** — o filho não pode alterá-las diretamente.
- **State**: dados internos e mutáveis de um componente, controlados pelo próprio componente (por meio do hook `useState`). Quando o state muda, o React re-renderiza o componente automaticamente.

```jsx
import { useState } from 'react';

function Contador() {
  const [contagem, setContagem] = useState(0);

  return (
    <div>
      <p>Você clicou {contagem} vezes</p>
      <button onClick={() => setContagem(contagem + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
```

![Diagrama de árvore de componentes mostrando App como componente pai passando props para Header, ListaDeTarefas e Footer, com o componente Tarefa mantendo seu próprio state](images/02-componentes-props-state.png)

---

## 5. Criando o primeiro projeto React

A forma recomendada atualmente pela documentação oficial (react.dev) é usar uma ferramenta de build moderna, como o **Vite**, em vez do antigo `create-react-app` (hoje descontinuado).

### Pré-requisitos

- **Node.js** instalado (versão LTS recomendada) — inclui o `npm`.
- Um editor de código (recomendado: VS Code).

### Passo a passo

```bash
# 1. Criar o projeto
npm create vite@latest meu-app -- --template react

# 2. Entrar na pasta do projeto
cd meu-app

# 3. Instalar as dependências
npm install

# 4. Rodar o servidor de desenvolvimento
npm run dev
```

Após o último comando, o terminal exibirá um endereço local (geralmente `http://localhost:5173`). Basta abri-lo no navegador para ver a aplicação React rodando.

### Estrutura de pastas gerada

![Diagrama da estrutura de pastas de um projeto React criado com Vite, mostrando node_modules, public, src com main.jsx, App.jsx, App.css e components, além de index.html, package.json e vite.config.js](images/03-estrutura-projeto.png)

Os arquivos mais importantes para o dia a dia de desenvolvimento são:

- **`src/main.jsx`**: ponto de entrada da aplicação; "monta" o componente `App` dentro do `index.html`.
- **`src/App.jsx`**: componente principal, geralmente o ponto de partida da interface.
- **`src/components/`**: pasta (a ser criada pelo próprio desenvolvedor) para organizar os demais componentes.

---

## 6. Primeiro componente na prática

Edite o arquivo `src/App.jsx` com o conteúdo abaixo:

```jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [nome] = useState('Turma de Full Stack');

  return (
    <div className="App">
      <h1>Meu primeiro app em React</h1>
      <p>Olá, {nome}! Este componente foi criado durante a aula de introdução ao React.</p>
    </div>
  );
}

export default App;
```

Salve o arquivo e observe o navegador: como o servidor do Vite está com **hot reload** ativado, a página é atualizada automaticamente a cada alteração salva.

---

## 7. Atividade prática sugerida

1. Criar um novo projeto React com Vite, seguindo o passo a passo da Seção 5.
2. Criar um componente chamado `CartaoAluno` que recebe via **props** o nome e a matrícula de um(a) estudante e exibe essas informações em um cartão estilizado.
3. Renderizar três instâncias de `CartaoAluno` dentro do componente `App`, cada uma com dados diferentes.
4. **Desafio extra:** adicionar um `useState` para controlar um contador de "curtidas" em cada cartão, com um botão que incrementa o valor ao ser clicado.

---

## 8. Resumo dos conceitos-chave

| Conceito | Definição resumida |
|---|---|
| **React** | Biblioteca JavaScript para construção de interfaces baseadas em componentes. |
| **JSX** | Sintaxe que mistura HTML e JavaScript, convertida em código JS pelo Babel. |
| **Componente** | Função que retorna JSX; unidade reutilizável de interface. |
| **Props** | Dados somente leitura passados de um componente pai para um filho. |
| **State** | Dados internos e mutáveis de um componente, gerenciados com `useState`. |
| **Virtual DOM** | Representação em memória da interface, usada para otimizar atualizações no DOM real. |
| **Vite** | Ferramenta moderna de build usada para criar e rodar projetos React localmente. |

---

## 9. Para saber mais (leitura complementar)

- Documentação oficial: [react.dev/learn](https://react.dev/learn)
- W3Schools React Tutorial: [w3schools.com/react](https://www.w3schools.com/react/react_intro.asp)
- Próximos tópicos recomendados para a disciplina: eventos e formulários controlados, `useEffect` e ciclo de vida, listas e chaves (`key`), roteamento com React Router e consumo de APIs REST.
