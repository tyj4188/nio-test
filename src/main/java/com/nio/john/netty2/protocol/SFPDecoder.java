/*
 *
 * 项目名：	com.nio.john.netty2.protocol
 * 文件名：	SFPDecoder
 * 模块说明：
 * 修改历史：
 * 2018/4/4 - JOHN - 创建。
 */

package com.nio.john.netty2.protocol;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;
import org.apache.commons.lang.StringUtils;
import org.msgpack.MessagePack;

import java.util.List;

/**
 * 反序列化
 * @author JOHN
 * @date 2018/4/4
 */
public class SFPDecoder extends ByteToMessageDecoder {

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out)
        throws Exception {
        try {
            int length = in.readableBytes();
            byte[] bytes = new byte[length];

            String content = new String(bytes, in.readerIndex(), length);

            if(StringUtils.isNotEmpty(content)) {
                // 判断是否是自定义消息协议
                if(!MessageStatus.isSFP(content)) {
                    // 非自定义协议直接 remove
                    ctx.channel().pipeline().remove(this);
                    return;
                }
            }

            in.getBytes(in.readerIndex(), bytes, 0, length);
            out.add(new MessagePack().read(bytes, MessageObject.class));
            in.clear();
        } catch (Exception e) {
            ctx.channel().pipeline().remove(this);
        }
        return;
    }
}
