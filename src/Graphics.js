import { h, Component } from 'preact'
import * as PIXI from 'pixi.js'
import Base from './Base'

class Graphics extends Base
{
    componentRender(node)
    {
        let vnode = this.render()
        const { children } = vnode || node
        const { parent } = this.props
        const { ref, object } = (vnode || {}).attributes || {}
        this.container = new PIXI.Graphics()
        this.container.ticker = this.container.ticker || parent.ticker
        this.container.screen = this.container.screen || parent.screen

        
        this.container.clear()
        children.forEach(node => new node.nodeName(node, this.container))
        this.Align(this.container, this)
        this.objects[object] = this.container
        this.refs[ref] = this
        this.componentDidMount()
    }
}

Graphics.Generic = class Generic
{
    constructor(node, graphics)
    {
        const { color, style } = node.attributes
        color && graphics.beginFill(...color)
        style && graphics.lineStyle(...style)
    }
    Close(node, graphics)
    {
        const { endFill } = node.attributes
        endFill && graphics.endFill()
    }
}

Object.assign(Graphics,
{
    Point: class Point extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { x, y } = node.attributes
            graphics.moveTo(x, y)
            super.Close(node, graphics)
        }
    },
    Line: class Line extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { x, y } = node.attributes
            graphics.lineTo(x, y)
            super.Close(node, graphics)
        }
    },
    Rect: class Rect extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { x, y, width, height } = node.attributes
            graphics.drawRect(x, y, width, height)
            super.Close(node, graphics)
        }
    },
    RoundedRect: class RoundedRect extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { x, y, width, height, radius } = node.attributes
            graphics.drawRoundedRect(x, y, width, height, radius)
            super.Close(node, graphics)
        }
    },
    Circle: class Circle extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { x, y, radius } = node.attributes
            graphics.drawCircle(x, y, radius)
            super.Close(node, graphics)
        }
    },
    QuadraticCurve: class QuadraticCurve extends Graphics.Generic
    {
        constructor(node, graphics)
        {
            super(node, graphics)
            const { cpX, cpY, toX, toY } = node.attributes
            graphics.quadraticCurveTo(cpX, cpY, toX, toY)
            super.Close(node, graphics)
        }
    }
})

export default Graphics