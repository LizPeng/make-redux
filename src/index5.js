//优化性能
function stateChanger(state, action) {
  //appState和stateChanger合并到一起去
  //stateChanger现在既充当了获取初始化数据的功能，也充当了生成更新数据的功能。
  //如果传入state就生成更细年数据，否则就是初始化数据。
  if(!state){
    return {
      title: {
        text:'React.js 小书',
        color:'red',
      },
      content: {
        text: 'React.js 小书内容',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT' :
          return { 
            ...state,
            title:{
              ...state.title,
              text:action.text
            }
          }
    case 'UPDATE_TITLE_COLOR' :
          return { 
            ...state,
            title:{
              ...state.title,
              color: action.color
            }
          }
    default: 
      return state 
  }
}
//这样我们可以优化createStore成一个参数，因为state和stateChanger合并到一起了
//createStore内部的state不再通过参数传入，而是一个局部变量 let state=null

//我们给 stateChanger 这个玩意起一个通用的名字：reducer
function createStore (reducer) {
  let state = null 
  const listeners = [] 
  const subscribe = (listener)=> listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action) //覆盖原对象
    listeners.forEach((listener)=> listener())
  }
  dispatch({}) //初始化state
  //createStore的最后会手动调用一次dispatch({})，dispatch内部会调用stateChanger，这时候的state是null，所以这次的dispatch其实就是初始化数据了。
  //createStore内部第一次的dispatch导致state初始化完成，后续外部的dispatch就是修改数据的行为了
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


function themeReducer(state, action){
	if(!state) return {
		themeName: 'Red Theme',	
		themeColor: 'red'
	}
	switch (action.type) {
    case 'UPDATE_THEME_NAME' :
      return { ...state, themeName: action.themeName }
    case 'UPDATE_THEME_COLOR':
      return { ...state, themeColor: action.themeColor}
    default:
      return state
	}	
}



const store = createStore(appState, stateChanger)
let oldState = store.getState()
store.subscribe ( ()=>{
  const newState = store.getState() //数据可能变化，获取西你的state
  renderApp(newState, oldState) 
  oldState = newState 
}) 
renderApp(store.getState()) 

store.dispatch({ type:'UPDATE_TITLE_TEXT',text:'React小书' })
store.dispatch({ type:'UPDATE_TITLE_COLOR', color:'blue'}) 


