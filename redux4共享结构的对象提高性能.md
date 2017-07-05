##共享结构的对象

希望大家都知道这种ES6的语法：

    const obj = {a:1, b:2}
    const obj2 = {...obj} // =>{a:1, b:2}


`const obj2 = { ...obj }`其实就是新建一个对象obj2，然后把obj所有的属性都复制到obj2里面，相当于对象的浅复制。上面的obj里面的内容和obj2是完全一样的，但是却是两个不同的对象。除了浅复制对象，还可以覆盖、拓展对象属性：

    const obj = {a:1, b:2}
    cosnt obj2 = {...obj, b:3, c:4} //=>{a:1,b:3,c:4}

我们可以把这种特性应用在state的更新上，我们禁止直接修改原来的对象，一旦你要修改某些东西，你就得把修改路径上的所有对象复制一遍，例如，我们不写鞋面的修改：

    appState.title.text = '<React.js小书>'

取而代之的是，我们新建一个`appState`，新建`appState.title`，新建`appState.title.text`:
    
    let newAppState = { //新建一个newAppState
    	...appState, //复制appState里面的内容
    	title:{ //用一个新的对象覆盖原来的title属性
    		...appState.title	 //复制原来title对象里面的内容
    		text: '《React.js小书》' //覆盖text属性 
    	}
    }


如果我们用一个树状的结构来表示对象解构的话：

![](http://huzidaha.github.io/static/assets/img/posts/C8A1EB09-2D4E-442E-AD6D-E4997B4AF1C1.png)

appState和newAppState其实是两个不同的对象，因为对象浅复制的缘故，其实它们里面的属性content指向的同一个对象；但是因为title被一个新的对象覆盖了，所以它们的title属性指向的对象是不同的。同样地，修改appState.title.color:

    let newAppState1 = {
      ...newAppState,
      title:{
	    ...newAppState.title,
	    color: "blue"
      }
    }

![](http://huzidaha.github.io/static/assets/img/posts/4E4E9324-4659-4791-8957-137566C3A929.png)

我们每次修改某些数据的时候，都不会碰原来的数据，而是把需要修改数据路径上的对象都copy一个出来。这样有什么好处？看看我们的目的已经达到了：
    
    appState !== newAppState // true，两个对象引用不同，数据变化了，重新渲染
    appState.title !== newAppState.title // true，两个对象引用不同，数据变化了，重新渲染
    appState.content !== appState.content // false，两个对象引用相同，数据没有变化，不需要重新渲染

修改数据的时候就把修改路径都复制一遍，但是保持其他内容不变，最后的所有对象具有某些不变共享的机构（例如上面三个对象都共享content对象）。大多数情况下我们可以保持50%以上的内容具有共享结构，这种操作具有非常优良的特性，我们可以用它来优化上面的渲染性能。

##优化性能

我们修改`stateChanger`，让它修改数据的时候，并不会直接修改原来的数据`state`，而是产生上述的共享结构的对象：


    function stateChanger(state, action) {
      switch (action.type) {
		case 'UPDATE_TITLE_TEXT' :
		  return { //构建新的对象并且返回
		    ...state,
		    title:{
		      ...state.title,
		      text:action.text
		  }
	    }
	    case 'UPDATE_TITLE_COLOR' :
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
    
 代码稍微比原来长了一点，但是是值得的。每次需要修改的时候都会产生新的对象，并且返回。而如果没有修改（在default语句中）则返回原来的state对象。

因为`stateChanger`不会修改原来对象了，而是返回对象，所以我们需要修改一下`createStore`。让它每次`stateChanger(state, action)`的调用结果覆盖原来的`state`：

我们成功把不必要的页面渲染优化掉了，问题解决。另外，并不需要担心每次修改都新建共享结构对象会有性能、内存问题，因为构建对象的成本非常低，而且我们最多保存两个对象引用（oldState和newState)，其余旧的对象都会被辣鸡回收掉。


