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
import com.nio.john.netty2.protocol.MessageObject;
import com.nio.john.netty2.protocol.MessageStatus;
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.AttributeKey;
import io.netty.util.concurrent.GlobalEventExecutor;
import org.apache.commons.lang.StringUtils;

/**
 * 消息处理
 * @author JOHN
 * @date 2018/4/4
 */
public class MessageProcessor {

    // 管理所有用户的channel
    private static ChannelGroup userGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    private MessageCodec codec = new MessageCodec();

    // Channel 的属性
    private AttributeKey<String> nickName = AttributeKey.valueOf("nickName");

    public void messageHandler(Channel client, String message) {
        if(null == client || StringUtils.isBlank(message)) { return; }

        // 解码为消息对象
        MessageObject msgObj = codec.decode(message);
        if(null == msgObj) { return; }

        // 登录命令
        if(MessageStatus.Type.LOGIN.getValue().equals(msgObj.getCmd())) {
            client.attr(nickName).set(msgObj.getNickName()); // 为Channel绑定昵称属性
            userGroup.add(client); // 将用户的channel添加到ChannelGroup中
            // 循环遍历 Channel, 将登录信息发送给其他用户
            String msg = "";
            for(Channel channel : userGroup) {
                // 当前登录用户消息
                if(channel == client) {
                    msg = "已经与服务器建立连接";
                } else {
                    msg = msgObj.getNickName() + " 加入聊天室";
                }
                // 封装消息对象
                MessageObject sendMsg = new MessageObject(MessageStatus.Type.SYSTEM.getValue()
                    , System.currentTimeMillis(), msgObj.getNickName(), msg, userGroup.size());
                // 发送消息
                channel.writeAndFlush(new TextWebSocketFrame(codec.encode(sendMsg)));
            }
        }

    }

    public void messageHandler(Channel client, MessageObject message){
        messageHandler(client, codec.encode(message));
    }

    /**
     * 处理登出消息
     * @param client
     */
    public void logout(Channel client) {
        userGroup.remove(client); // 从Group中移除当前登出的用户
        String userName = client.attr(nickName).get(); // 获取用户昵称
        if(StringUtils.isNotEmpty(userName)) {
            MessageObject message = new MessageObject(MessageStatus.Type.SYSTEM.getValue()
                , System.currentTimeMillis(), null, userName + "退出了聊天室"
                , userGroup.size());
            String content = codec.encode(message);
            for(Channel user : userGroup) {
                user.writeAndFlush(new TextWebSocketFrame(content));
            }
        }
    }
}
