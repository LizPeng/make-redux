//代表我们应用的状态
const appState = {
  title: {
    text:'React.js 小书',
    color:'red',
  },
  content: {
    text: 'React.js 小书内容',
    color: 'blue'
  }
}
////////////////

//新增几个渲染函数,会把上面状态的数据渲染到页面上
function renderApp (appState) {
  renderTitle(appState.title)
  renderContent(appState.content)
}

function renderTitle (title) {
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = title.text
  titleDOM.style.color = title.color
}

function renderContent (content) {
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = content.text
  contentDOM.style.color = content.color
}

renderApp(appState)