/*
 *
 * 项目名：	com.nio.john.netty3.server.protocol
 * 文件名：	MessageUtil
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server.protocol;

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
}
