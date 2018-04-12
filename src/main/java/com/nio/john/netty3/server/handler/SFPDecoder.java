/*
 *
 * 项目名：	com.nio.john.netty3.server.handler
 * 文件名：	SFPDecoder
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.handler;

import com.nio.john.netty3.server.protocol.MessageCodec;
import com.nio.john.util.MessageUtil;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;
import org.apache.commons.lang.StringUtils;

import java.util.List;

/**
 * 从 Buff 中读取消息转换成协议实体
 * @author JOHN
 * @date 2018/4/11
 */
public class SFPDecoder extends ByteToMessageDecoder {

    private MessageCodec codec = new MessageCodec();

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out)
        throws Exception {
        try {
            // 可读长度
            int length = in.readableBytes();
            byte[] bytes = new byte[length];
            in.getBytes(in.readerIndex(), bytes, 0, length);
            String msg = new String(bytes, in.readerIndex(), length);
            if(StringUtils.isNotEmpty(msg)) {
                // 判断是否是有效协议消息
                if(MessageUtil.isNotSFP(msg)) {
                    ctx.channel().pipeline().remove(this);
                    return;
                } else {
                    out.add(codec.decode(msg));
                    in.clear();
                }
            }
        } catch (Exception e) {
            ctx.channel().pipeline().remove(this);
            e.printStackTrace();
        }
    }
}
