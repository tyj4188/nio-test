/*
 *
 * 项目名：	com.nio.john.netty3.server.processor
 * 文件名：	MessageProcessor
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.processor;

import com.nio.john.netty3.server.protocol.MessageCodec;
import com.nio.john.netty3.server.protocol.MessageObject;
import com.nio.john.util.MessageUtil;
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.AttributeKey;
import io.netty.util.concurrent.GlobalEventExecutor;

/**
 * @author JOHN
 * @date 2018/4/11
 */
public class MessageProcessor {

    // 记录用户 Channel
    private static ChannelGroup users = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    // 设置 Channel 属性
    private AttributeKey<String> nickNameKey = AttributeKey.valueOf("nickName");

    private MessageCodec codec = new MessageCodec();

    /**
     * 对各种类型的消息进行处理
     * @param client
     * @param msgStr
     */
    public void messageHandler(Channel client, String msgStr) {
        if(null == client || null == msgStr || "".equals(msgStr.trim())) {
            return;
        }
        this.messageHandler(client, codec.decode(msgStr));
    }

    public void messageHandler(Channel client, MessageObject msgObj) {
        if(null == client || null == msgObj || msgObj.isEmpty()) {
            return;
        }

        // 登录消息
        if(MessageUtil.isLogin(msgObj.getCmd())) {
            loginHandler(client, msgObj);
        } else if(MessageUtil.isChat(msgObj.getCmd())) {
            chatHandler(client, msgObj);
        }

    }

    private void chatHandler(Channel client, MessageObject msgObj) {
        for(Channel channel : users) {
            if(channel == client) {
                continue;
            }
            MessageUtil.sendMsg(channel, MessageObject.CMD.CHAT, msgObj.getNickName()
                , msgObj.getContent(), codec);
        }
    }

    private void loginHandler(Channel client, MessageObject msgObj) {
        // 设置昵称
        client.attr(nickNameKey).set(msgObj.getNickName());
        users.add(client);
        for(Channel channel : users) {
            String content = channel == client ? "已与服务器建立连接" : msgObj.getNickName() + " 加入聊天室";
            MessageUtil.sendMsg(channel, MessageObject.CMD.SYSTEM, msgObj.getNickName(), content, codec);
        }
    }
}
