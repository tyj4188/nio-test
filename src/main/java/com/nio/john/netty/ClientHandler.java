/* 版权所有(C)，上海海鼎信息工程股份有限公司，2018，所有权利保留。
 * 
 * 项目名：	com.nio.john.netty
 * 文件名：	ClientHandler
 * 模块说明：	
 * 修改历史：
 * 2018/3/26 - Tyj - 创建。
 */

package com.nio.john.netty;

import com.nio.john.util.CHARSET;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;

/**
 * @author Tyj
 * @date 2018/3/26
 */
public class ClientHandler extends ChannelHandlerAdapter {

    // 数据写出
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        String msg = "我是土豆!";
        // 获取指定长度的 buffer
        ByteBuf buf = Unpooled.buffer(msg.length());
        // 先写入缓冲区
        buf.writeBytes(msg.getBytes());
        // 通过上下文把缓冲区的数据写出
        ctx.writeAndFlush(buf);
        System.out.println("给服务端回复的信息 : " + msg);
    }

    // 数据读入
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;
        byte[] bytes = new byte[buf.readableBytes()];
        buf.readBytes(bytes);
        String serverMsg = new String(bytes, CHARSET.UTF_8.getValue());
        System.out.println("服务端 : " + serverMsg);
    }

    // 异常处理
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("客户端连接出现异常, Netty 关闭 !");
        ctx.close(); // 释放资源
    }
}
