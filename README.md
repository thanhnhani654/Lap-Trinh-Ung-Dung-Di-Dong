# Lap-Trinh-Ung-Dung-Di-Dong
### Mục lục  
[I. Cài đặt Cordova](#Modau)  
[II. Hưỡng dẫn chạy chương trình](#chaychuongtrinh)  
[III. Giới thiệu Game](#gioithieugame)  
[IV. Link Tải Game](#taigame)  
<a name="Modau"></a>
### [I. Cài đặt Cordova](https://evothings.com/doc/build/cordova-install-windows.html)  
<a name="chaychuongtrinh"></a>
### II. Hưỡng dẫn chạy chương trình  
Đầu tiên các bạn vào folder main và mở cửa sổ command promt bằng cách gõ cmd trên thanh address:  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B1.png?raw=true">  
      Sau đó các bạn cần phải thêm thư viện của Phaser vào folder www:  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B2.png?raw=true">  
      Để chạy thử game trên máy tính, các bạn cần thêm platform vào:  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B3.png?raw=true">  
      Bây giờ bạn có thể chạy thử Game trên máy tính, Ctrl-C 2 lần trong cửa sổ CMD để ngừng:  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B4.png?raw=true">  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B5.png?raw=true">  
      Còn nếu các bạn muốn build ra app điện thoại thì các bạn làm theo các bước sau (Chưa thử IOS bao giờ):  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B6.png?raw=true">  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B7.png?raw=true">  
      Và theo đường dẫn dưới đây để tới cái app mà bạn build ra:  
      <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Huong%20dan%20chay%20chuong%20trinh%20IMG/B8.png?raw=true">  
 <a name="gioithieugame"></a>
### III. Giới thiệu Game  
Game Thủ Thành chiến thuật với nhiệm vụ của bạn là xây dựng các tháp phòng thủ ngăn cản và tiêu diệt kẻ thù không cho kẻ thù đến điểm Goal.  
       #### 1.	Giao diện 
            Giao diện Game gồm có:  
            - 3 Button dùng để xây tháp phòng thủ và thông tin tháp phòng thủ  
            - 1 Button dùng để bắt đầu đợt tấn công  
            - 1 Điểm Spawn nơi kẻ thù xuất hiện  
            - 1 Điểm Goal nơi kẻ thù đi đến  
            - 1 Board: Nơi mà kẻ thù xác định đường đi và cũng là nơi để xây tháp  
            - Thông tin Gold và Live của Player  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Giao%20dien%201.png?raw=true">  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Giao%20dien%202.png?raw=true">  
       #### 2.	GamePlay  
      Mục đích của người chơi là xây các tháp phòng thủ ngăn cản đường đi của kẻ thù, tiêu diệt kẻ thù không để kẻ thù đi đến điểm Goal.  
            Cách chơi:  
            - Khi bắt đầu Player có 10 Gold dùng để xây tháp và 5 Lives  
            - Để xây tháp Player chọn Button tháp mình muốn xây sau đó chọn ô trên Board để xây  
                  + Nếu Gold của Player ít hơn số Gold Tháp cần hoặc nơi tháp xây bít hết đường đi của kẻ thù thì Tháp sẽ không xuất hiện.  
                  + Nếu tháp được xây trên đường đi của kẻ thù thì kẻ thù sẽ phải thay đổi đường đi.   
            - Để Nâng Cấp hoặc Xóa tháp, Player nhấn giữ vào tháp một lúc rồi thả thì tháp sẽ hiện Button Xóa và Button Nâng Cấp. 
                  + Button Xóa  
                  + Button Nâng Cấp  
            - Có 2 loại Enemy:  
                  + Red Enemy: có tất cả 3 cấp độ với mức máu và lượng vàng rơi ra cao theo từng cấp độ, có thể bị các tower chặn đường.  
                        ++ Red Enemy Lv1: Hp 15, Gold 1.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/RedEnemylv1.png?raw=true">  
                        ++ Red Enemy Lv2: Hp 100, Gold 10.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/RedEnemylv2.png?raw=true">  
                        ++ Red Enemy Lv3: Hp 1000, Gold 100.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/RedEnemylv3png.png?raw=true">  
                  + Yellow Enemy: có tất cả 3 cấp độ với mức máu và lượng vàng rơi ra cao theo từng cấp độ, không thể bị các tower chặn đường.  
                        ++ Yellow Enemy Lv1: Hp 10, Gold 4.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/YellowEnemylv1.png?raw=true">  
                        ++ Yellow Enemy Lv2: Hp 70, Gold 16.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/YellowEnemylv2.png?raw=true">  
                        ++ Yellow Enemy Lv3: Hp 600, Gold 100.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/YellowEnemylv3.png?raw=true">  
            - Có 3 loại Tower:  
                   + Tower 1: Có 3 Level, Có thể tấn công cả 2 loại Enemy, khi level 3 thì chỉ còn tấn công được Red Enemy.  
                        ++ Tower 1 Lv1: Tốc độc bắn 1.0, tấn công 3.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower1lv1.png?raw=true">  
                        ++ Tower 1 Lv2: Tốc độc bắn 2.5, tấn công 4.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower1lv2.png?raw=true">  
                        ++ Tower 1 Lv3: Tốc độc bắn 2.5, tấn công 24.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower1lv3.png?raw=true">  
                   + Tower 2: Có 1 Level, Có thể làm chậm tốc độ di chuyển của cả 2 loại Enemy.  
                        ++ Tower 2 Lv1: Làm chậm 30%.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower2.png?raw=true">  
                   + Tower 3: Có 2 Level, Chỉ có thể tấn công Yellow Enemy.  
                        ++ Tower 3 Lv1: Tốc độc bắn 0.5, tấn công 20.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower3lv1.png?raw=true">  
                        ++ Tower 3 Lv2: Tốc độc bắn 0.5, tấn công 100.<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Tower3lv2.png?raw=true">  

<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay1.png?raw=true">  
<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay2.png?raw=true">  
<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay3.png?raw=true">  
<img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay4.png?raw=true">  
 <a name="taigame"></a>
### IV. Link Tải Game
https://drive.google.com/file/d/1J0cLcfRWNupcelVdnunm_5Saqt-TOFjc/view?usp=sharing


