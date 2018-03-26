/*
 *
 * 项目名：	com.nio.john.client
 * 文件名：	Client
 * 模块说明：
 * 修改历史：
 * 2018/3/22 - JOHN - 创建。
 */

package com.nio.john.demo.version_1;

import com.nio.john.RSA.RSAUtils;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Iterator;
import java.util.Set;

/**
 * @author JOHN
 * @date 2018/3/22
 */
public class Client implements Runnable {

    private String host;

    private int port;

    private boolean isStop = false;

    private SocketChannel socketChannel;

    private Selector selector;

    private String data;

    private String publicKey;

    public Client(String host, int port, String data, String publicKey) {
        this.host = host;
        this.port = port;
        this.data = data;
        this.publicKey = publicKey;

        try {
            socketChannel = SocketChannel.open();
            selector = Selector.open();
            socketChannel.configureBlocking(false);
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    @Override
    public void run() {
        try{
            doConnect();
        } catch (Exception e) {
            e.printStackTrace();
        }

        while(!isStop) {
            try{
                selector.select(1000);
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                SelectionKey selectionKey = null;

                while(iterator.hasNext()) {
                    selectionKey = iterator.next();
                    iterator.remove();
                    handleInput(selectionKey);
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.exit(-1);
            }
        }
    }

    private void doConnect() throws Exception {
        boolean isConn = socketChannel.connect(new InetSocketAddress(host, port));
        if(isConn) {
            socketChannel.register(selector, SelectionKey.OP_READ);
            doWrite(socketChannel);
        } else {
            socketChannel.register(selector, SelectionKey.OP_CONNECT);
        }
    }

    private void doWrite(SocketChannel socketChannel)
        throws IOException, InvalidKeySpecException, NoSuchAlgorithmException {
        ByteBuffer sendBuff = ByteBuffer.allocate(2048);
        String encodeData = RSAUtils.publicEncrypt(data, RSAUtils.getPublicKey(publicKey));
        sendBuff.put(encodeData.getBytes());
        sendBuff.flip();
        socketChannel.write(sendBuff);
        if(!sendBuff.hasRemaining()) {
            System.out.println("Send data to server succeed.");
        }
    }

    private void handleInput(SelectionKey selectionKey) throws Exception {
        if(selectionKey.isValid()) {
            SocketChannel client = (SocketChannel) selectionKey.channel();
            if(selectionKey.isConnectable()) {
                if(client.finishConnect()) {
                    client.register(selector, SelectionKey.OP_READ);
                    doWrite(client);
                }
            }
            if(selectionKey.isReadable()) {
                ByteBuffer receiveBuff = ByteBuffer.allocate(1024);
                int count = client.read(receiveBuff);
                if(0 < count) {
                    receiveBuff.flip();
                    byte[] bytes = new byte[receiveBuff.remaining()];
                    receiveBuff.get(bytes);
                    String body = new String(bytes, "UTF-8");
                    System.out.println("密文 : " + body);
                    String decodeData = RSAUtils.publicDecrypt(body, RSAUtils.getPublicKey(publicKey));
                    System.out.println("明文 : " + decodeData);
                    this.isStop = true;
                } else if(0 > count) {
                    selectionKey.channel();
                    client.close();
                } else {

                }
            }
        }
    }

}

