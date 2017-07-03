#Redux(二): 抽离store和监控数据变化


上一节，我们有了 `appStore` 和 `diapatch`

现在我们把它们集中到一个地方，给这个地方起个名字叫做store，然后构建一个函数`createStore` ，用来专门生产这种state和dispatch的集合，这样别的App也可以用这种模式了：

    function createStore(state, stateChanger) {
    	const getState = （）=> state
    	const dispatch = (action) => stateChanger(state, action)
    	return { getState, dispatch}
    }
    
createStore接受两个参数，一个是表示应用程序状态的state；另外一个是stateChanger，它来描述应用程序状态会根据action发生什么变化，其实就是相当于本节开头的dispatch代码里面的内容。

 `createStore`会返回一个对象，这个对象包含两个方法getState和dispatch。getState用于获取state数据，其实就是简单地把state参数返回。

 `dispatch` 用于修改数据，和以前一样会接受action，然后会把`state`和`action`一并传给`stateChanger`，那么`stateChanger`就可以根据 `action`来修改state了。

function stateChanger(state, action) {
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
  const getState = () => state
  const dispatch = (action) => stateChanger(state, action)
  return { getState, dispatch }
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
    
    renderApp(store.getState()) //首次渲染页面
    
    store.dispatch({ type:'UPDATE_TITLE_TEXT',text:'React小书' })//修改标题文本
    store.dispatch({ type:'UPDATE_TITLE_COLOR', color:'blue'}) //修改标题颜色
    renderApp(store.getState()) //


针对每个不同的App，我们可以给createStore传入初始的数据`appState`，和一个描述数据变化的函数`stateChanger`，然后生成一个store。需要修改数据的时候通过store.dispatch,需要获取数据的时候通过store.getState 。

##监控数据变化

上面的代码有一个问题，我们每次通过`dispatch`修改数据的时候，其实只是数据发生了变化，如果我们不手动调用renderApp，页面上的内容是不会发生变化的。但是我们总不能每次`dispatch`的时候都手动调用一下`renderApp`，我们肯定希望数据变化的时候程序变化的时候程序能够智能一点地自动重新渲染数据，而不是手动调用。

我们希望用一种通用的方式“监听”数据变化，然后重新渲染页面，这里要用到观察者模式。修改`createStore`：

    function createStore （state, stateChanger) {
    	const listeners = [] 
    	const subscribe = (listener) => listeners.push(listener)
    	const getState = () => state
    	const dispatch = (action) => {
    		stateChanger(state, action)
    		listeners.forEach((listener) => listener())
    	}
    	return { getState, dispatch, subscribe }
    }

我们在createStore里面定义了一个数组listeners，还有一个新的方法subscribe，可以通过store.subscribe(listener)的方式给subscribe传入一个监听函数，这个函数会被push到数组当中。

我们修改了dispatch，每次当它被调用的时候，除了会调用stateChanger进行数据的修改，还会遍历listeners数组里面的函数，然后一个个地去调用。相当于我们可以通过subscribe传入数据变化的监听函数，每当dispatch的时候，监听函数就会被调用，这样我们就可以在每当数据变化时候进行重新渲染：

    const store = createStore(appState, stateChanger)
    store.subscribe( ()=> renderApp(store.getState()) ) 
    
    renderApp(store.getState()) //首次渲染页面
    store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    // ...后面不管如何 store.dispatch，都不需要重新调用 renderApp

我们只需要`subscribe`一次，后面不管如何`dispatch`进行数据修改，`renderApp`函数就会被重新调用，页面就会被重新被渲染。这样的订阅模式还有好处就是，以后我们还可以拿同一块数据来渲染别的页面，这时`dispatch`导致的变化也会让每个页面都重新渲染：

    const store = createStore(appState, stateChanger)
    
    store.subscribe( ()=> renderApp(store.getState()))
    store.subscribe( ()=> renderApp2(store.getState()))


##总结

现在我们有了一个比较通用的`createStore`，它可以产生一种我们新定义的数据类型`store`，通过`store.getState`我们获取共享状态，而且我们约定只能通过`store.dispatch`修改共享状态。`store`也允许我们通过`store.subscribe`监听数据状态被修改了 ，并且进行了后续的例如重新渲染页面的操作。