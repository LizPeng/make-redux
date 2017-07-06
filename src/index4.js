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

//优化性能
function stateChanger(state, action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT' :
          console.log(state.title.text)
          return { //构建新的对象并且返回
            ...state,
            title:{
              ...state.title,
              text:action.text
            }
          }
    case 'UPDATE_TITLE_COLOR' :
    console.log(state.title.color)
          return { //构建新的对象并且返回
            ...state,
            title:{
              ...state.title,
              color: action.color
            }
          }
    default: 
      return state //没有修改，返回原来的对象
  }
}

function createStore (state, stateChanger) {
  const listeners = [] 
  const subscribe = (listener)=> listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = stateChanger(state, action) //覆盖原对象
    listeners.forEach((listener)=> listener())
  }
  return { getState, dispatch, subscribe }
}


  function renderApp (newAppState, oldAppState={}) { 
    if(newAppState === oldAppState ) return 
    console.log('render app...')
    renderTitle(newAppState.title, oldAppState.title)
    renderContent(newAppState.content, oldAppState.content)
  }

  function renderTitle (newTitle, oldTitle={}) {
    if(newTitle === oldTitle ) return 
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.text
    titleDOM.style.color = newTitle.color
  }

  function renderContent (newContent, oldContent={}) {
    if (newContent === oldContent) return
    console.log('render content...')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = newContent.text
    contentDOM.style.color = newContent.color
  }
//取而代之的是，我们新建一个 appState，新建 appState.title，新建 appState.title.text：

let newAppState = { //新建一个newAppState
  ...appState,  //复制appState里面的内容
  title:{ //用一个新的对象覆盖原来的title属性
    ...appState.title, // 复制原来title对象里面的内容
    text: '《React.js小书》' //覆盖text属性
  }
}
//修改appState.title.color

let newAppState1 = {
  ...newAppState,
  title:{
    ...newAppState.title,
    color: "blue"
  }
}

const store = createStore(appState, stateChanger)
let oldState = store.getState()
store.subscribe ( ()=>{
  const newState = store.getState() //数据可能变化，获取新的state
  renderApp(newState, oldState) 
  oldState = newState 
}) 

renderApp(store.getState()) 

store.dispatch({ type:'UPDATE_TITLE_TEXT',text:'React小书' })
store.dispatch({ type:'UPDATE_TITLE_COLOR', color:'blue'}) 


