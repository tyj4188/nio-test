/*
 *
 * 项目名：	com.nio.john.netty2
 * 文件名：	Message
 * 模块说明：
 * 修改历史：
 * 2018/3/29 - JOHN - 创建。
 */

package com.nio.john.netty2.protocol;

/**
 * 消息实体
 * @author JOHN
 * @date 2018/3/29
 */
public class MessageObject {
    // 消息类型
    private String cmd;

    // 发送时间
    private long sendTime;

    // 用户ID
    private String userId;

    // 昵称
    private String nickName;

    // 消息内容
    private String content;

    // 当前在线人数
    private int onlineCount;

    public MessageObject() {
    }

    public MessageObject(String cmd, long sendTime, String nickName) {
        this.cmd = cmd;
        this.sendTime = sendTime;
        this.nickName = nickName;
    }

    public MessageObject(String cmd, long sendTime, String nickName, String content) {
        this(cmd, sendTime, nickName);
        this.content = content;
    }

    public MessageObject(String cmd, long sendTime, String nickName, String content, int onlineCount) {
        this(cmd, sendTime, nickName);
        this.content = content;
        this.onlineCount = onlineCount;
    }

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }

    public long getSendTime() {
        return sendTime;
    }

    public void setSendTime(long sendTime) {
        this.sendTime = sendTime;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getOnlineCount() {
        return onlineCount;
    }

    public void setOnlineCount(int onlineCount) {
        this.onlineCount = onlineCount;
    }
}
