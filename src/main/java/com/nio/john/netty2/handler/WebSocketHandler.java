/*
 *
 * 项目名：	com.nio.john.netty2.handler
 * 文件名：	WebSocketHandler
 * 模块说明：
 * 修改历史：
 * 2018/4/10 - JOHN - 创建。
 */

package com.nio.john.netty2.handler;

import com.nio.john.netty2.processor.MessageProcessor;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;

/**
 * @author JOHN
 * @date 2018/4/10
 */
public class WebSocketHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private MessageProcessor processor = new MessageProcessor();

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, TextWebSocketFrame msg)
        throws Exception {
        // 客户端与服务端交互
        processor.messageHandler(ctx.channel(), msg.text());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        // 处理连接断开事件
        processor.logout(ctx.channel());
    }
}
