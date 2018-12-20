# Lap-Trinh-Ung-Dung-Di-Dong

[1. Cài đặt Cordova](https://evothings.com/doc/build/cordova-install-windows.html)  

2. Hưỡng dẫn chạy chương trình  
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
[3. Giới thiệu Game]  
Game Thủ Thành chiến thuật với nhiệm vụ của bạn là xây dựng các tháp phòng thủ ngăn cản và tiêu diệt kẻ thù không cho kẻ thù đến điểm Goal.  
      1.	Giao diện  
            Giao diện Game gồm có:  
            - 3 Button dùng để xây tháp phòng thủ và thông tin tháp phòng thủ  
            - 1 Button dùng để bắt đầu đợt tấn công  
            - 1 Điểm Spawn nơi kẻ thù xuất hiện  
            - 1 Điểm Goal nơi kẻ thù đi đến  
            - 1 Board: Nơi mà kẻ thù xác định đường đi và cũng là nơi để xây tháp  
            - Thông tin Gold và Live của Player  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Giao%20dien%201.png?raw=true">  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/Giao%20dien%202.png?raw=true">  
       2.	GamePlay  
      Mục đích của người chơi là xây các tháp phòng thủ ngăn cản đường đi của kẻ thù, tiêu diệt kẻ thù không để kẻ thù đi đến điểm Goal.  
            Cách chơi:  
            - Khi bắt đầu Player có 10 Gold dùng để xây tháp và 5 Lives  
            - Để xây tháp Player chọn Button tháp mình muốn xây sau đó chọn ô trên Board để xây  
                  + Nếu Gold của Player ít hơn số Gold Tháp cần hoặc nơi tháp xây bít hết đường đi của kẻ thù thì Tháp sẽ không xuất hiện.  
                  + Nếu tháp được xây trên đường đi của kẻ thù thì kẻ thù sẽ phải thay đổi đường đi.   
            - Để Nâng Cấp hoặc Xóa tháp, Player nhấn giữ vào tháp một lúc rồi thả thì tháp sẽ hiện Button Xóa và Button Nâng Cấp.  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay1.png?raw=true">  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay2.png?raw=true">  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay3.png?raw=true">  
            <img src="https://github.com/thanhnhani654/Lap-Trinh-Ung-Dung-Di-Dong/blob/master/Huong%20dan/Gioi%20Thieu%20Game%20IMG/GamePlay4.png?raw=true">  


