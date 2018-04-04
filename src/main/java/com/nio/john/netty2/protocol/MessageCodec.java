/*
 *
 * 项目名：	com.nio.john.netty2.protocol
 * 文件名：	MessageCodec
 * 模块说明：
 * 修改历史：
 * 2018/3/30 - JOHN - 创建。
 */

package com.nio.john.netty2.protocol;

import org.apache.commons.lang.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 消息编解码
 * @author JOHN
 * @date 2018/3/30
 */
public class MessageCodec {

    /**
     * 消息解码
     * @param msg 具体消息
     * @return
     */
    public MessageObject decode(String msg) {
        if(StringUtils.isEmpty(msg)){return null;}

        String headers = "", content = ""; // 消息头 / 消息体

        Pattern pattern = Pattern.compile("^\\[(.*)\\](\\s-\\s(.*))?");
        Matcher matcher = pattern.matcher(msg);
        if(matcher.find()) {
            headers = matcher.group(1);
            content = matcher.group(3);
        }
        String[] split = headers.split("\\]\\[");
        String cmd = split[0]; // [cmd] [time] [user] - content
        long time = Long.parseLong(split[1]);
        String nikeName = split[2];

        // 是否需要解析消息体
        if(MessageStatus.Type.LOGIN.getValue().equals(cmd)
            || MessageStatus.Type.LOGOUT.getValue().equals(cmd)) {
            return new MessageObject(cmd, time, nikeName);
        } else if (MessageStatus.Type.SYSTEM.getValue().equals(cmd)
            || MessageStatus.Type.CHAT.getValue().equals(cmd)) {
            return new MessageObject(cmd, time, nikeName, content);
        }
        return null;
    }

    public String encode(MessageObject msg) {
        if(null == msg) {return null;}

        StringBuilder msgBuild = new StringBuilder();

        msgBuild.append("[").append(msg.getCmd()).append("][")
            .append(msg.getSendTime()).append("]");

        if(msg.equals(MessageStatus.Type.SYSTEM.getValue())) {
            msgBuild.append("[" + msg.getOnlineCount() + "]");
        } else if(msg.equals(MessageStatus.Type.LOGIN.getValue())
            || msg.equals(MessageStatus.Type.LOGOUT.getValue())
            || msg.equals(MessageStatus.Type.CHAT.getValue())) {

            msgBuild.append("[" + msg.getNickName() + "]");
        }

        if(StringUtils.isNotBlank(msg.getContent())) {
            msgBuild.append("-" + msg.getContent());
        }

        return msgBuild.toString();
    }

}
