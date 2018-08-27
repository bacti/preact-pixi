import { h, Component } from 'preact'
import * as PIXI from 'pixi.js'
import Base from './Base'

export default class Stage extends Base
{
    componentDidMount()
    {
        const { options } = this.props
        this.root = new PIXI.Application(options)
        this.container = this.root.stage
        this.props.root = this.root
        this.props.ticker = this.root.ticker
        this.props.screen = this.root.screen
        this.RenderContainer()
    }

    render()
    {
        const { options } = this.props
        return <canvas ref={canvas => (options.view = canvas)} />
    }
}
