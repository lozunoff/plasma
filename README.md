# Plasma

<p align="center">
  <img width="800" src="https://user-images.githubusercontent.com/1813468/98610527-d37ba500-2300-11eb-87c3-80cc1c08ecb4.png" alt="plasma" />
</p>

Использование дизайн-системы `Plasma` позволяет реализовать [Canvas App](https://bit.ly/3Mx0UQq) как часть экосистемы виртуальных ассистентов семейства "Салют". Все текущие приложения в экосистеме реализованы с помощью `Plasma`.

## Состав:

- @salutejs/ui
- @salutejs/plasma-tokens

 [![npm ui](https://img.shields.io/npm/v/@salutejs/ui/rc?label=%40salutejs%2Fui%40rc&style=for-the-badge)](https://www.npmjs.com/package/@salutejs/ui) 
 [![npm ui](https://img.shields.io/npm/v/@salutejs/plasma-tokens/rc?label=%40salutejs%2Fplasma-tokens%40rc&style=for-the-badge)](https://www.npmjs.com/package/@salutejs/plasma-tokens)

### plasma-tokens

Пакет с набором `дизайн-токенов`. В пакет входят типографические и цветовые константы. `Дизайн-токены` поставляются в качестве `css` [custom propperties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) и `js` переменных. Перед использованием `ui` рекомендуется ознакомится с содержимым этого [пакета](./packages/plasma-tokens/README.md)

### ui

Пакет с набором готовых компонентов для создания `Canvas App`. Компоненты реализованы с помощью [React](https://reactjs.org/). Для компонентов доступна [витрина](https://master--5f96ec813d800900227e3b93.chromatic.com) и [документация](https://plasma-docs.netlify.app).

## Быстрый старт

`Canvas App` это web-приложение, для его создания вам потребуется:

-   `Node.js` & `npm` [установка](https://nodejs.org/ru/)

-   `Create React App` – для быстрого создания основы вашего приложения. [CRA](https://create-react-app.dev/docs/getting-started#quick-start)

-   `React` Как основа для web интерфейса. Погружение для новичков: https://ru.reactjs.org/tutorial/tutorial.html

### Установка

После создания [основы приложения](https://create-react-app.dev/docs/getting-started#quick-start):

```sh
npm i -S styled-components @salutejs/ui@rc @salutejs/plasma-tokens@rc
```

_Компоненты реализованы с помощью [styled-components](http://styled-components.com/). Поэтому необходимо поставить их в зависимость._

NB: Если вы решили не использовать `Create React App`, то вам потребуется установить `react` и `react-dom`:

```sh
npm i -S react react-dom
```

### Использование

```jsx
// ./src/App.jsx
import React from 'react';

import { Button } from '@salutejs/ui/components/Button/Button';

function App() {
    return (
        <div className="App">
            <p>
                <Button view="primary">Hello Plasma</Button>
            </p>
        </div>
    );
}

export default App;
```

Для каждого компонента есть документация описывающая его поведение и модификации. [Документация](https://plasma-docs.netlify.app/components/Button) для компонента `Button` из примера.

## Обратная связь

Разработка `plasma` ведется в репозитории https://github.com/salute-developers/plasma.
Если вы хотите добавить новый компонент, вы можете прислать пулл-реквест следуя [правилам разработки](./CONTRIBUTING.md). Также вы можете [завести задачу](https://github.com/salute-developers/plasma/issues/new) на создание нового компонента или описать некоректное поведение текущего.
