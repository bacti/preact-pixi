import * as PIXI from 'pixi.js'
import { render, Component } from 'preact'
import ElementFactory from './ElementFactory'

const IsFunction = input => typeof input === 'function'
const IsNumeric = n => !isNaN(parseFloat(n))
export default class Base extends Component
{
    static RenderIf = predicate => elemOrThunk => predicate ? (IsFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : undefined
    SetupContainer(container, component)
    {
        const { children } = component.props || component
        children.forEach(node => ElementFactory.Instance(node, container, component, this))
        this.Align(container, component)
    }

    RenderContainer()
    {
        this._component && this.SetupContainer(this.container, this._component)
        this.SetupContainer(this.container, this)
    }

    Align(container, component)
    {
        const { screen } = this.props.root
        const {
            width,
            height,
            position,
            anchor,
            scale,
            rotation,
            alpha,
            filters,
            filterArea,
            visible = true,
            box,
            align = 'center',
            verticalAlign = 'middle',
        } = component.attributes || component.props || {}
        position && container.position.set(...position)
        anchor && container.anchor.set(...anchor)
        scale && container.scale.set(...scale)
        IsNumeric(rotation) && (container.rotation = rotation)
        IsNumeric(alpha) && (container.alpha = alpha)
        filters && (container.filters = filters)
        filterArea && (container.filterArea = filterArea)
        visible != undefined && (container.visible = visible)
        if (box)
        {
            container.box = { width: box[0], height: box[1] }
            let scale = Math.min(1, container.box.width / container.width, container.box.height / container.height)
            container.texture && (container.texture.scale = scale)
            container.scale.set(scale)
            switch (align)
            {
                case 'left':
                {
                    container.anchor.x = 0
                    // container.x = 0
                    break
                }
                case 'center':
                {
                    container.anchor.x = 0.5
                    container.x += container.box.width / 2
                    break
                }
                case 'right':
                {
                    container.anchor.x = 1
                    container.x += container.box.width
                    break
                }
            }
            switch (verticalAlign)
            {
                case 'top':
                {
                    container.anchor.y = 0
                    // container.y = 0
                    break
                }
                case 'middle':
                {
                    container.anchor.y = 0.5
                    container.y += container.box.height / 2
                    break
                }
                case 'bottom':
                {
                    container.anchor.y = 1
                    container.y += container.box.height
                    break
                }
            }
        }

        width && (container.width = screen.width * width)
        height && (container.height = screen.height * height)

        const {
            onClick,
            onPointerDown,
            onPointerUp,
            onPointerUpOutside,
            onPointerOver,
            onPointerOut,
            onPointerMove,
        } = component.attributes || component.props || {}
        onClick && this.BindEvent(container, 'pointertap', onClick)
        onPointerDown && this.BindEvent(container, 'pointerdown', onPointerDown)
        onPointerUp && this.BindEvent(container, 'pointerup', onPointerUp)
        onPointerUpOutside && this.BindEvent(container, 'pointerupoutside', onPointerUpOutside)
        onPointerOver && this.BindEvent(container, 'pointerover', onPointerOver)
        onPointerOut && this.BindEvent(container, 'pointerout', onPointerOut)
        onPointerMove && this.BindEvent(container, 'pointermove', onPointerMove)
        container.interactive = true
        container.buttonMode = true
    }

    BindEvent(container, event, callback)
    {
        let action = event + '.'
        container[action] && container.off(event, container[action])
        container[action] = callback
        container.on(event, callback)
    }

    BindUpdate()
    {
        const { ticker } = this.props.root
        this.container.update && ticker.remove(this.container.update)
        this.container.update = deltatime => this.Update(deltatime)
        ticker.add(this.container.update)
    }

    constructor()
    {
        super()
        this.objects = {}
        this.refs = {}
    }

    setState(state)
    {
        super.setState(state)
        this.componentRender()
    }

    componentRender(node)
    {
        this.container = this.container || new PIXI.Container()
        if (!this.componentReady())
            return
        let vnode = this.render()
        this.props.children = (vnode && vnode.children) || []
        this.componentMount()
        this.componentDidMount()
    }

    componentReady()
    {
        return true
    }

    componentMount()
    {
        this.RenderContainer()
    }

    componentDidMount()
    {
    }
}
