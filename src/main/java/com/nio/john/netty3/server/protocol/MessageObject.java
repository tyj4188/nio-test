/*
 *
 * 项目名：	com.nio.john.netty3.server.protocol
 * 文件名：	MessageObject
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.protocol;

/**
 * [cmd][sendTime][nickName][online]-content
 * @author JOHN
 * @date 2018/4/11
 */
public class MessageObject {
    // 消息类型
    private String cmd;

    // 发送用户
    private String nickName;

    // 发送时间
    private long sendTime;

    // 消息内容
    private String content;

    // 当前在线人数
    private int online;

    /**
     * 消息类型
     */
    public enum CMD {
        // 系统, 登录, 登出, 聊天
        SYSTEM("SYSTEM"), LOGIN("LOGIN"), LOGOUT("LOGOUT"), CHAT("CHAT");
        private String value;

        CMD(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public MessageObject() {
    }

    public MessageObject(String cmd, String nickName, long sendTime) {
        this.cmd = cmd;
        this.nickName = nickName;
        this.sendTime = sendTime;
    }

    public MessageObject(String cmd, String nickName, long sendTime, String content) {
        this(cmd, nickName, sendTime);
        this.content = content;
    }

    public MessageObject(String cmd, String nickName, long sendTime, String content, int online) {
        this(cmd, nickName, sendTime, content);
        this.online = online;
    }

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public long getSendTime() {
        return sendTime;
    }

    public void setSendTime(long sendTime) {
        this.sendTime = sendTime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getOnline() {
        return online;
    }

    public void setOnline(int online) {
        this.online = online;
    }

    public boolean isEmpty() {
        return null == this.getCmd() || "".equals(this.getCmd().trim());
    }

    public boolean hasContent() {
        return null != this.getContent() && !"".equals(this.getContent().trim());
    }

}
