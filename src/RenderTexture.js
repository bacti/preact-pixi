import { h, Component } from 'preact'
import * as PIXI from 'pixi.js'
import Base from './Base'

export default class RenderTexture extends Base
{
    Update(deltaTime)
    {
        const { root, clear } = this.props
        root.renderer.render(this.source, this.rt, clear)
    }

    componentDidMount()
    {
        const { autoUpdate = true } = this.props
        autoUpdate && this.BindUpdate()
    }

    componentRender(node, top)
    {
        const { root, source, base } = this.props
        this.source = typeof(source) == 'object' ? source : top.objects[source] || root.stage
        this.rt = PIXI.RenderTexture.create(...base)

        this.container = new PIXI.Sprite(this.rt)
        this.container.rt = this.rt
        this.Align(this.container, this)
        this.componentDidMount()
    }
}
