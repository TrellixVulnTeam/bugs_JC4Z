"""
/********************************************************************
*
*  文件名：main_file_classify.py
*
*  文件描述：猫狗识别
*
*  创建人： qiwei_ji, 2020年10月4日
*
*  版本号：1.2_alpha
*
*  修改记录：10
*
************************* *******************************************/
"""
# coding=utf-8
import os

os.environ['CUDA_VISIBLE_DEVICES'] = '0'
from support import *
from resnet import resnet18

# 部分训练参数参数
data_root = './dataset'
epochs = 200  # 训练次数
batch_size = 128  # 批处理大小
num_workers = 4  # 多线程
LR = 0.04  # 初始学习速率
weight_decay = 1e-4

# seed
set_random_seed(31)

# 对加载的图像作归一化处理，并裁剪为[224x224x3]大小的图像，加载数据
load_data = Data_loader(data_root, num_workers, batch_size)
train_loader = load_data.trainloader()
test_loader = load_data.testloader()

# 网络实例化
net = resnet18(num_classes=100).cuda()  # 分类
result = train(net, epochs, LR, train_loader, test_loader, weight_decay=weight_decay)
write_result(format(net.__class__.__name__), epochs, batch_size, num_workers, LR, result[0], weight_decay, result[1],
             result[2])
