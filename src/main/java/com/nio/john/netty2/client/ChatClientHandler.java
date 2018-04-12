/*
 *
 * 项目名：	com.nio.john.netty2.client
 * 文件名：	ChatClientHandler
 * 模块说明：
 * 修改历史：
 * 2018/4/9 - JOHN - 创建。
 */

package com.nio.john.netty2.client;

import com.nio.john.netty2.protocol.MessageCodec;
import com.nio.john.netty2.protocol.MessageObject;
import com.nio.john.netty2.protocol.MessageStatus;
import com.nio.john.util.CHARSET;
import com.nio.john.util.DateUtil;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;

import java.util.Date;
import java.util.Scanner;

/**
 * @author JOHN
 * @date 2018/4/9
 */
public class ChatClientHandler extends ChannelHandlerAdapter {
    private static final String NICK_NAME = "JOHN";
    private Channel client;
    private MessageCodec codec = new MessageCodec();

    public ChatClientHandler() {
        super();
    }

    /**
     * Channel被激活时
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.client = ctx.channel();
        sendMsg(MessageStatus.Type.LOGIN);
        System.out.println("成功连接至服务器，已执行登录动作");
        session();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;
        byte[] bytes = new byte[buf.readableBytes()];
        buf.readBytes(bytes);
        String msgStr = new String(bytes, CHARSET.UTF_8.getValue());
        MessageObject message = codec.decode(msgStr);
        printMsg(message);
    }

    /**
     * 会话
     */
    private void session() {
        new Thread(){
            @Override
            public void run() {
                System.out.println(NICK_NAME + " ,你好! 请在控制台输入消息内容。");
                Scanner sc = new Scanner(System.in);
                boolean stop = false;
                try {
                    do{
                        String content = sc.nextLine();
                        if("exit".equals(content)) {
                            sendMsg(MessageStatus.Type.LOGOUT);
                            stop = true;
                        } else {
                            sendMsg(MessageStatus.Type.CHAT, content);
                        }
                    } while (!stop);
                    sc.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    private void printMsg(MessageObject msg) {
        if(null == msg) {
            System.out.println("系统 : 读取消息异常！");
        }
        String sendDateStr = DateUtil.dateToString(new Date(msg.getSendTime())
            , DateUtil.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS);
        // 系统消息
        if(MessageStatus.Type.SYSTEM.getValue().equals(msg.getCmd())) {
            System.out.println("系统 " + sendDateStr + "：" + msg.getContent()
                + "[" + msg.getOnlineCount() + "]人在线");
        } else if(MessageStatus.Type.CHAT.getValue().equals(msg.getCmd())) {
            if(!NICK_NAME.equals(msg.getNickName())) {
                System.out.println(msg.getNickName() + " " + sendDateStr + "：" + msg.getContent());
            }
        }
    }

    private void sendMsg(MessageStatus.Type msgType) {
        this.sendMsg(msgType, null);
    }

    private void sendMsg(MessageStatus.Type msgType, String content) {
        MessageObject msg = new MessageObject(msgType.getValue()
            , System.currentTimeMillis(), NICK_NAME, content);
        this.client.writeAndFlush(msg);
        System.out.println("消息发送成功, 请继续输入 : ");
    }
}
