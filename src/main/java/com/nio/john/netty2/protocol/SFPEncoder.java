/*
 *
 * 项目名：	com.nio.john.netty2.protocol
 * 文件名：	SFPEncoder
 * 模块说明：
 * 修改历史：
 * 2018/4/4 - JOHN - 创建。
 */

package com.nio.john.netty2.protocol;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;
import org.msgpack.MessagePack;

/**
 * @author JOHN
 * @date 2018/4/4
 */
public class SFPEncoder extends MessageToByteEncoder<MessageObject> {
    protected void encode(ChannelHandlerContext ctx, MessageObject msg, ByteBuf out)
        throws Exception {
        out.writeBytes(new MessagePack().write(msg));
    }
}
