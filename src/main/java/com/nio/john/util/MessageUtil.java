/*
 *
 * 项目名：	com.nio.john.netty3.server.protocol
 * 文件名：	MessageUtil
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.util;

import com.nio.john.netty3.server.protocol.MessageCodec;
import com.nio.john.netty3.server.protocol.MessageObject;
import io.netty.channel.Channel;

import java.util.Date;

/**
 * @author JOHN
 * @date 2018/4/11
 */
public class MessageUtil {
    public static boolean isSystem(String cmd) {
        return MessageObject.CMD.SYSTEM.getValue().equals(cmd);
    }

    public static boolean isLogin(String cmd) {
        return MessageObject.CMD.LOGIN.getValue().equals(cmd);
    }

    public static boolean isLogout(String cmd) {
        return MessageObject.CMD.LOGOUT.getValue().equals(cmd);
    }

    public static boolean isChat(String cmd) {
        return MessageObject.CMD.CHAT.getValue().equals(cmd);
    }

    /**
     * 判断是否是有效的协议
     * @param msg
     * @return
     */
    public static boolean isSFP(String msg) {
        return msg.matches("^\\[(SYSTEM|LOGIN|LOGOUT|CHAT)\\]");
    }

    public static boolean isNotSFP(String msg) {
        return !isSFP(msg);
    }

    public static void sendMsg(Channel channel, MessageObject.CMD cmd, String nickName
        , String content, MessageCodec codec) {
        sendMsg(channel, cmd, nickName, content,0, codec);
    }

    public static void sendMsg(Channel channel, MessageObject.CMD cmd, String nickName
        , String content, int online, MessageCodec codec) {
        MessageObject send = new MessageObject(cmd.getValue(), nickName,
            new Date().getTime(), content, online);
        channel.writeAndFlush(codec.encode(send));
    }
}
