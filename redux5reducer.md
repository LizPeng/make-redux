    function stateChanger (state, action) {
      if (!state) {
	    return {
	      title: {
	    text: 'React.js 小书',
	    color: 'red',
	      },
	      content: {
	    text: 'React.js 小书内容',
	    color: 'blue'
	      }
	    }
      }
      switch (action.type) {
	    case 'UPDATE_TITLE_TEXT':
	      return {
		    ...state,
		    title: {
		      ...state.title,
		      text: action.text
		    }
	      }
	    case 'UPDATE_TITLE_COLOR':
	      return {
		    ...state,
		    title: {
		      ...state.title,
		      color: action.color
		    }
	      }
	    default:
	      return state
	   }
    }

stateChanger现在既充当了获取初始化数据的功能，也充当了生成更新数据的功能。

我们给stateChanger这个玩意起一个通用的名字：reducer，不要问为什么，它就是个名字而已，修改createStore的参数名字：

    function createStore (reducer) {
      let state = null
      const listeners = []
      const subscribe = (listener) => listeners.push(listener)
      const getState = () => state
      const dispatch = (action) => {
	    state = reducer(state, action)
	    listeners.forEach((listener) => listener())
	  }
      dispatch({}) // 初始化 state
      return { getState, dispatch, subscribe }
    }

这是一个最终形态的`createStore`，它接受的参数叫reducer，reducer是一个函数，细心的朋友会发现，它其实是一个纯函数（Pure Function）。

## reducer

createStore接受一个叫reducer的函数作为参数，**这个函数规定是一个纯函数**，它接受两个参数，一个是state，一个是action。

如果没有传入state或者state是null，那么它就会返回一个初始化的数据。如果有传入state的话，就会根据action来“修改”数据，但其实它没有、也规定不能修改state，而是要通过上节所说的把修改路径的对象都复制一遍，然后生产一个新的对象返回。如果它不能识别你的action，就不会产生新的数据，而是（在default内部）把state原封不动地返回。

reducer是不允许有副作用的。你不能再里面操作DOM，也不能发Ajax请求，更不能直接修改state，它要做的仅仅是--**初始化和计算新的state**。

现在我们可以用这个createStore来构建不同的store了，只要给它传入符合上述定义的reducer即可：

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
	const store = createStore(themeReducer)


## 总结

我们从一个简单的例子的代码中发现了共享的状态如果可以被任意修改的话，那么程序的行为将非常不可预测，所以我们提高了修改数据的门槛：你必须通过dispatch执行某些允许的修改操作，而且必须大张旗鼓的在action里面声明。

这种模式挺好用的，我们就把它抽象出来一个createStore，它可以产生store，里面包含getState和dispatch函数，方便我们使用。

后来发现每次修改数据都需要手动重新渲染非常麻烦，我们希望自动重新渲染视图。所以后来加入了订阅者模式，可以通过store.subscribe订阅数据修改事件，每次数据更新的时候自动重新渲染视图。

接下来我们发现了原来的“重新渲染视图”有比较严重的性能问题，我们引入了“共享结构的对象”来帮我们解决问题，这样就可以在每个渲染函数的开头进行简单的判断避免没有被修改过的数据重新渲染。

我们又花了stateChanger为reducer，定义了reducer只能是纯函数，功能就是负责初始state，和根据state和action计算具有共享结构的新的state。

createStore现在可以直接拿来用了，套路就是：

    //定一个reducer
    function reducer （state, action){
    	/*初始化state和 switch case*/
    }
    //生成store
    const store = createStore(reducer)
    
    //监听数据变化冲洗你渲染页面
    store.subscribe( ()=> renderApp(store.getState()))
    
    //首次渲染页面
    renderApp(store.getState())
    
    //后面可以随意dispatch了，页面自动更新
    store.dispatch(..)
    

现在的代码跟React.js一点关系都没有，接下来我们要把React.js和Redux结合起来，用Redux模式帮助管理React.js的应用状态。

