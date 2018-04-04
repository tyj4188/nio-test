/*
 *
 * 项目名：	com.nio.john.netty2.processor
 * 文件名：	MessageProcessor
 * 模块说明：
 * 修改历史：
 * 2018/4/4 - JOHN - 创建。
 */

package com.nio.john.netty2.processor;

import com.nio.john.netty2.protocol.MessageCodec;
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.AttributeKey;
import io.netty.util.concurrent.GlobalEventExecutor;

/**
 * 消息处理
 * @author JOHN
 * @date 2018/4/4
 */
public class MessageProcessor {

    // 管理所有用户的channel
    private static ChannelGroup userChannel = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    private MessageCodec codec = new MessageCodec();

    // Channel 的属性
    private AttributeKey<String> nickName = AttributeKey.valueOf("nickName");

    public void messageHandler(Channel client, String message) {

    }
}
