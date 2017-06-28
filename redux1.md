#Redux(一): 优雅地修改共享状态
你要用React.js基本都要伴随着Redux和React.js结合的库React-redux。

要注意的是，**Redux和React-redux并不是一个东西。**

Redux是一种架构模式（Flux架构的一种变种），它不关注你到底用什么库，你可以把它应用到React和Vue，甚至跟jQuery结合都没有问题。

而React-redux就是把Redux这种架构模式和React.js结合起来的一个库，就是Redux架构在React.js中的体现。

不同的模块（组件）之间确实需要共享数据，这些模块（组件）还可能需要修改这些共享数据，就像上一节的“主题色”状态（themeColor）。这里的矛盾就是：**“模块（组件）之间需要共享数据”，和“数据可能被任意修改导致不可预测的结果”之间的矛盾**

我们定义一个函数，叫dispatch，它专门负责数据的修改：


    function dispatch (action) {
    	switch (action.type) {
    		case 'UPDATE_TITLE_TEXT' :
    			appState.title.text = action.text
    			break
    		case 'UPDATE_TITLE_COLOR' :
    			appState.title.color = action.color
    			break
    		default:
    			break	
    	}
    }


**所有对数据的操作必须通过 `dispatch` 函数**。它接受一个参数action，这个action是一个普通的JavaScript对象，里面必须包含一个type字段来声明你到底想干什么。dispatch在switch里面会识别这个type字段，能够识别出来的操作才会执行对appState的修改。

上面的dispatch它只能识别两种操作，一种是UPDATE_TITLE_TEXT，一种是UPDATE_TITLE_COLOR。可以看到，action除了type字段是必须的意外，其他字段都可以自定义的。

任何的模块如果想要修改 `appState.title.text`，必须大张旗鼓地调用dispatch：
    
    dispatch({ type: 'UPDATE_TITLE_TEXT', text: '<React.js小书>'})
    dispatch({ tyep: 'UPDATE_TITLE_COLOR', color:'blue'})

我们来看看有什么好处：
    
    loadDataFromServer() // => 里面可能通过dispatch修改标题文本
    doSomethingUnexpected()
    doSomethingMore() // => 里面可能通过dispatch修改标题颜色
    //....
    renderApp(appState)

我们不需要担心`renderApp(appState)`之前的那堆函数操作会干什么奇奇怪怪得事情，因为我们规定不能直接修改appState，它们对appState的修改只能通过dispatch。而我们看看dispatch的实现可以知道，你只能修改
`title.text` 和 `title.color `。

如果某个函数修改了 `title.text` 但是我并不想要它这么干，我需要debug出来是哪个函数修改了，我只需要在dispatch的 switch的第一个case内部打个断点就可以调试出来了。


下一节我们会把这种dispatch的模式抽离出来，让它变得更加通用。