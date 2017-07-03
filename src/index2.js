//代表我们应用的状态
let appState = {
  title: {
    text:'React.js 小书',
    color:'red',
  },
  content: {
    text: 'React.js 小书内容',
    color: 'blue'
  }
}

function stateChanger(state, action) {
  console.log(state)
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT' :
          state.title.text = action.text 
          break
    case 'UPDATE_TITLE_COLOR' :
          state.title.color = action.color
          break
    default: 
          break
  }
}

function createStore (state, stateChanger) {
  const listeners = [] 
  const subscribe = (listener)=> listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    stateChanger(state, action)
    listeners.forEach((listener)=> listener())
  }
  return { getState, dispatch, subscribe }
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

//修改数据的生成的方式
const store = createStore(appState, stateChanger)
store.subscribe ( ()=>renderApp(store.getState()) ) 
renderApp(store.getState()) //首次渲染页面

store.dispatch({ type:'UPDATE_TITLE_TEXT',text:'React小书' })//修改标题文本
store.dispatch({ type:'UPDATE_TITLE_COLOR', color:'blue'}) //修改标题颜色

// ...后面不管如何 store.dispatch，都不需要重新调用 renderApp
