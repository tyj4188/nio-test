/*
 *
 * 项目名：	com.nio.john.netty3.server.protocol
 * 文件名：	MessageCodec
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.protocol;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 消息编解码
 * @author JOHN
 * @date 2018/4/11
 */
public class MessageCodec {

    /**
     * 将字符串格式消息解码为实体对象
     * 完整消息形式: [cmd][sendTime][sender]-content
     * 或: [cmd][sendTime][online]-content
     * @param msgStr
     * @return
     */
    public MessageObject decode(String msgStr) {
        if(null == msgStr || "".equals(msgStr.trim())) {
            return null;
        }
System.out.println("MessageCodec.decode - 客户端发送消息 : " + msgStr);
        Pattern pattern = Pattern.compile("^\\[(.*)\\](-(.*))?");
        Matcher matcher = pattern.matcher(msgStr);
        // 消息头和消息体
        String header = "", content = "";
        // 没匹配到就返回
        if(!matcher.find()) {
            return null;
        }
        header = matcher.group(1);
        content = matcher.group(3);
        String[] splits = header.split("\\]\\[");
        String cmd = splits[0];
        long sendTime = Long.parseLong(splits[1]);
        String sender = splits[2];
        // 登录和登出消息没有消息体
        if(MessageUtil.isLogin(cmd) || MessageUtil.isLogout(cmd)) {
            return new MessageObject(cmd, sender, sendTime);
        } else if (MessageUtil.isSystem(cmd) || MessageUtil.isChat(cmd)) {
            return new MessageObject(cmd, sender, sendTime, content);
        }
        return null;
    }

    /**
     * 将消息实体对象编码为字符串
     * @param msgObj
     * @return
     */
    public String encode(MessageObject msgObj) {
        if(null == msgObj || msgObj.isEmpty()) {
            return null;
        }
        StringBuilder builder = new StringBuilder("[");
        builder.append(msgObj.getCmd()).append("][").append(msgObj.getSendTime()).append("]");

        if(MessageUtil.isSystem(msgObj.getCmd())) {
            // 系统消息显示在线人数
            builder.append("[").append(msgObj.getOnline()).append("]");
        } else if(MessageUtil.isLogin(msgObj.getCmd())
            || MessageUtil.isLogout(msgObj.getCmd())
            || MessageUtil.isChat(msgObj.getCmd())) {
            // 非系统消息显示用户昵称
            builder.append("[").append(msgObj.getNickName()).append("]");
        }
        // 判断是否有消息内容
        if(msgObj.hasContent()) {
            builder.append("-").append(msgObj.getContent());
        }

        return builder.toString();
    }

}
