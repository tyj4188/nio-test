/*
 *
 * 项目名：	com.nio.john.netty2.handler
 * 文件名：	SFPHandler
 * 模块说明：
 * 修改历史：
 * 2018/4/4 - JOHN - 创建。
 */

package com.nio.john.netty2.handler;

import com.nio.john.netty2.protocol.MessageObject;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * @author JOHN
 * @date 2018/4/4
 */
public class SFPHandler extends SimpleChannelInboundHandler<MessageObject> {
    protected void messageReceived(ChannelHandlerContext ctx, MessageObject msg) throws Exception {

    }
}
