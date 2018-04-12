/*
 *
 * 项目名：	com.nio.john.netty3.server.handler
 * 文件名：	SFPDecoder
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.handler;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

import java.util.List;

/**
 * 从 Buff 中读取消息转换成协议实体
 * @author JOHN
 * @date 2018/4/11
 */
public class SFPDecoder extends ByteToMessageDecoder {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out)
        throws Exception {

    }
}
