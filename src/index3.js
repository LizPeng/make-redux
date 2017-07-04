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


  function renderApp (newAppState, oldAppState={}) { //防止oldAppState没有传入，所以加了默认参数oldAppState={}
    if(newAppState === oldAppState ) return //数据没有变化就不渲染了
    console.log('render app...')
    renderTitle(newAppState.title, oldAppState.title)
    renderContent(newAppState.content, oldAppState.content)
  }

  function renderTitle (newTitle, oldTitle={}) {
    if(newTitle === oldTitle ) return // 数据没有变化就不渲染了
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.text
    titleDOM.style.color = newTitle.color
  }

  function renderContent (newContent, oldContent={}) {
    if (newContent === oldContent) return // 数据没有变化就不渲染了
    console.log('render content...')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = newContent.text
    contentDOM.style.color = newContent.color
  }

//修改数据的生成的方式
const store = createStore(appState, stateChanger)
let oldState = store.getSate() //保存旧的state
store.subscribe ( ()=>{
  const newState = store.getState() //数据可能变化，获取新的state
  renderApp(newState, oldState) //把新旧的state传进去渲染
  oldState = newState //渲染完以后，新的newState变成了旧的oldState，等待下一次数据变化重新渲染
}) 
renderApp(store.getState()) 

store.dispatch({ type:'UPDATE_TITLE_TEXT',text:'React小书' })
store.dispatch({ type:'UPDATE_TITLE_COLOR', color:'blue'}) 


