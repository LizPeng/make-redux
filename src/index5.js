//我们给 stateChanger 这个玩意起一个通用的名字：reducer
function createStore (reducer) {
  let state = null 
  const listeners = [] 
  const subscribe = (listener)=> listeners.push(listener) //订阅者模式，订阅数据修改事件，每次数据更新的时候自动重新渲染视图
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

  //引入“共享结构对象”
  function renderApp (newAppState, oldAppState={}) { 
    if(newAppState === oldAppState ) return 
    console.log('render app...')
    renderTheme(newAppState, oldAppState)
  }

  function renderTheme (newTitle, oldTitle={}) {
    if(newTitle === oldTitle ) return 
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.themeName
    titleDOM.style.color = newTitle.themeColor
  }




//纯函数reducer
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



//生成store
const store = createStore(themeReducer)
let oldState = store.getState()
//监听数据变化重新渲染页面
store.subscribe ( ()=>{
  const newState = store.getState() //数据可能变化，获取新的state
  renderApp(newState, oldState) 
  oldState = newState 
}) 

//首次渲染页面
renderApp(store.getState()) 

//随意dispatch，页面自动更新
store.dispatch({ type:'UPDATE_THEME_NAME',themeName:'THEME-NAME' })
store.dispatch({ type:'UPDATE_THEME_COLOR', themeColor:'blue'}) 


