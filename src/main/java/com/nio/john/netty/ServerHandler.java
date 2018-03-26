/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	NettyServer
 * 模块说明：
 * 修改历史：
 * 2018/3/26 - JOHN - 创建。
 */

package com.nio.john.netty;

import com.nio.john.util.CHARSET;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public class ServerHandler extends ChannelHandlerAdapter {

    /**
     * 处理读请求
     * @param ctx 上下文 - 用于写出数据
     * @param msg 字节缓冲 - 用于读入数据
     * @throws Exception
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 强转字节缓冲
        ByteBuf byteBuf = (ByteBuf) msg;
        // 获取可读字节数
        byte[] bytes = new byte[byteBuf.readableBytes()];
        byteBuf.readBytes(bytes);
        String clientMsg = new String(bytes, CHARSET.UTF_8.getValue());
        System.out.println("客户端 : " + clientMsg);

        // 回写数据
        ByteBuf respBuf = Unpooled.copiedBuffer("----------服务端回复数据---------".getBytes());

        // 通过上下文写出
        ctx.writeAndFlush(respBuf);
    }
}
