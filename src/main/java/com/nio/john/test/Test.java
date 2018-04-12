/*
 *
 * 项目名：	com.nio.john.test
 * 文件名：	Test
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.test;

import java.util.Scanner;

/**
 * @author JOHN
 * @date 2018/4/11
 */
public class Test {
    public static void main(String[] args) throws Exception {
        new Thread(){
            @Override
            public void run() {
                System.out.println("输入 : ");
                Scanner scanner = new Scanner(System.in);
                boolean stop = false;
                while(!stop) {
                    String str = scanner.nextLine();
                    if("exit".equals(str)) {
                        stop = true;
                        break;
                    } else {
                        System.out.println("输入结果 : " + str);
                    }
                }
            }
        }.start();

        while (true) {
            System.out.println("主线程输出 !!!!");
            Thread.sleep(2000);
        }
    }
}
