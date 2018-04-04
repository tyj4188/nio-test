/*
 *
 * 项目名：	com.nio.john.netty2.protocol
 * 文件名：	MessageType
 * 模块说明：
 * 修改历史：
 * 2018/3/30 - JOHN - 创建。
 */

package com.nio.john.netty2.protocol;

/**
 * 消息类型定义
 * @author JOHN
 * @date 2018/3/30
 */
public class MessageStatus {

    public enum Type {

        LOGIN("LOGIN"), LOGOUT("LOGOUT"), SYSTEM("SYSTEM"), CHAT("CHAT");

        private String value;

        Type(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

    /**
     * 判断是否是有效消息类型
     * @param msg
     * @return
     */
    public static boolean isSFP(String msg) {
        return msg.matches("^\\[(SYSTEM|LOGIN|LOGOUT|CHAT)\\]");
    }

    // 判断消息类型是否需要解析消息体
    public static boolean hasContent(String cmd) {
        if(MessageStatus.Type.LOGIN.getValue().equals(cmd) || MessageStatus.Type.LOGOUT.getValue().equals(cmd)) {
            return false;
        } else if (MessageStatus.Type.SYSTEM.getValue().equals(cmd) || MessageStatus.Type.CHAT.getValue().equals(cmd)) {
            return true;
        }
        return false;
    }
}
