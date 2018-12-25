document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        autoResize: true,
        parent: 'game',
		physics: {
        default: 'arcade',
        arcade: { debug: false }
		},
        width: 640,
        height: 342,
        scene: {
            preload: preload,
            create: create,
			update: update,
			extend: {
				CreateBullet1: CreateBullet1,
			}
        }
    };
    
    var game = new Phaser.Game(config);
	var RECTWIDTH = 64;
	var RECTHEIGHT = 45;
	var spawnpoint;
	var goalpoint;
	var pathController;
	
	var graphics;
	var graphics2;
	var graphics3;
	
	//Global varible
	var board;
	var waveControl;
	var getDelta;
	var button1;
	var buttonTower2;
	var buttonTower3;
	var buttonRestartGame;
	var saleButton;
	var upgradeButton;
	var buildTowerID; 				//Xác định loại Tower cần build khi building
	var rangeColor = 0x070077;
	var rangeAlpha = 0.4;
	var gold = 10;
	var live = 5;
	var goldText;
	var goldDisplay;
	var liveText;
	var liveDisplay;
	var resetGold = false;
	var stopSpawn = false;
	var countRestartTap = 0;
	var countRestartTapTime = 3;
	
	//Array list
	var listTower = [];
	var listTower2 = [];
	var listTower3 = [];
	var listEnemy = [];
	var listEnemy2 = [];
	var path = [];
	var listBullet1 = [];
	var spawnList = [];
	
	
	var debugNode = false;			//Sửa lỗi false thi gam ko chay duoc
	
	//Debug with Keyboard
	var keyA;
	var keySpace;
	
	//Debug
	var debugText;
	var debugText2;
	
	//Tap Display Upgrade and Sale UI 
	var bModifingTower;
	var bTapping;
	var bTapOnTowerButton = false;
	
	//PathFinding
	var pathCurves;
	var bCreateFollower = false;
	var bPathCreated = false;
	
	//Waves
	
	
	//=================================Board & Path==============================//
	// Thông tin Node liên quan đến đường đi
	function PathNode()
	{
		var x = 0;
		var y = 0;
		var countPath = -1;
		var debugNodeImg;
		var par = null;
	}
	
	// Mỗi Node là 1 ô, node chứa thông tin về ô đó
	function NodeRect()
	{
		var rectangle;
		var indexX;
		var indexY;
		var object = null;
		var pathNode;
	}
	
	// Các giá trị của 1 Board
	function BoardGame(){
		var bBuilding = false;			// Có đang xây dựng
		var bCanBuild = false;			// Có thể xây dựng hay không? ví dụ như xây lên một ô đã có Tower rồi là không thể
		var bStartBuild = false;		// Bắt đầu quá trình xây dựng, chắc hơi dư
		var rectangles;					// Mảng chứa danh sách toàn bộ node của các ô
		var buildingTemplate;			// Cái màu xanh xanh khi xây
		var index;						// Dung de xac dinh vi tri cua buildingTemplate trong mang rectangles
	}
	
	//Tạo Board =))
	function CreateBoard (g){
		var board = new BoardGame();
		board.rectangles = [];
		board.buildingTemplate = new Phaser.Geom.Rectangle(0, 0, RECTWIDTH, RECTHEIGHT);
		
			for(var x = 1; x < 9; x++)
			{
				for(var y = 0; y < 5; y++)
				{
					var node = new NodeRect();
					// Lấy vị trí node
					node.indexX = x - 1;
					node.indexY = y ;
					
					// Tạo ô
					node.rectangle = new Phaser.Geom.Rectangle(x * RECTWIDTH, y * RECTHEIGHT, RECTWIDTH, RECTHEIGHT);
					
					// Khởi tạo thông tin Node cần cho Path
					node.pathNode = new PathNode();
					node.pathNode.x = x * RECTWIDTH + RECTWIDTH / 2;
					node.pathNode.y = y * RECTHEIGHT + RECTHEIGHT / 2;
					node.pathNode.countPath = -1;
					
					//if (debugNode){
						node.pathNode.debugNodeImg = new Phaser.Geom.Circle(x * RECTWIDTH + RECTWIDTH / 2, y * RECTHEIGHT + RECTHEIGHT / 2, 10);
					//	graphics2.fillStyle(0xaa0000);
					//	graphics2.fillCircleShape(node.pathNode.debugNodeImg);
					//}
					
					board.rectangles.push(node);
				}
			}
		board.rectangles[2].pathNode.countPath = 0;
		// 2dArray => board.rectangles[x*5 + y]  with x < 8 && y < 5
		return board;
	}
	
	// Thuật toán tìm đường đi: Bắt đầu từ 1 ô có sẵn, Xem xét 4 ô xung quanh kiểm tra 4 ô có thể đi được không. 
	// Những ô đi được xem được thêm vào một list đồng thời những ô đó sẽ ghi nhớ lại ô trước đó sau đó đệ quy 
	// tiếp tục xem xét những ô xung quanh những ô có trong list đến khi đến điểm Goal.
	// Để giảm số lần lặp countPath có tác dụng đánh dấu ô đó đã được xem xét rồi nên không cần xem xét add list lại
	
	function PathController() {
		var timeDrawPath = 1;						//Thời gian tô xanh mấy cái điểm
		var timeDrawPathCount = timeDrawPath;
		var DrawPathCount;							//Đếm số điểm tạo thành đường đi
		var bDrawPath = false;
	}
	
	var bHavePath = false;
	// Tìm đường đi
	function PathFinding(x,y, list) {
		var newList = [];

		if (list.length == 0)		//Chay lan dau khi chua co san List 
		{
			var localhavePath = false;
			//Right
			if (x < 7) {
				if (board.rectangles[(x+1)*5+y].pathNode.countPath == -1 && !board.rectangles[(x+1)*5+y].object){
					
					board.rectangles[(x+1)*5+y].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
					newList.push(board.rectangles[(x+1)*5+y]);
					board.rectangles[(x+1)*5+y].pathNode.par = board.rectangles[2];
					localhavePath = true;
					
				}
			}
			//Top
			if (y > 0) {
				if (board.rectangles[x*5+y-1].pathNode.countPath == -1 && !board.rectangles[x*5+y-1].object){
					board.rectangles[x*5+y-1].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
					newList.push(board.rectangles[x*5+y-1]);
					board.rectangles[x*5+y-1].pathNode.par = board.rectangles[2];
					localhavePath = true;
				}
			}
			//Bottom
			if (y < 4) {
				if (board.rectangles[x*5+y+1].pathNode.countPath == -1 && !board.rectangles[x*5+y+1].object){
					board.rectangles[x*5+y+1].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
					newList.push(board.rectangles[x*5+y+1]);
					board.rectangles[x*5+y+1].pathNode.par = board.rectangles[2];
					localhavePath = true;
				}
			}
			
			//Left
			if (x > 0) {
				if (board.rectangles[(x-1)*5+y].pathNode.countPath == -1 && !board.rectangles[(x-1)*5+y].object){
					board.rectangles[(x-1)*5+y].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
					newList.push(board.rectangles[(x-1)*5+y]);
					board.rectangles[(x-1)*5+y].pathNode.par = board.rectangles[2];
					localhavePath = true;
				}
			}
			
			if (!localhavePath) {
				bHavePath = false;
				return;
			}
		}
		else {
			var localhavePath = false;
			for (var i = 0; i< list.length; i++){
				
				var x = list[i].indexX;
				var y = list[i].indexY;
				
				if (list[i].indexX == 7 && list[i].indexY == 2)
				{					
					path.push(board.rectangles[x*5+y].pathNode);
					bHavePath = true;
					localhavePath = true;
					return list[i].pathNode.par;
				}
				
				//Right
				if (list[i].indexX < 7) {
					if (board.rectangles[(x+1)*5+y].pathNode.countPath == -1 && !board.rectangles[(x+1)*5+y].object){
					
						board.rectangles[(x+1)*5+y].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
						newList.push(board.rectangles[(x+1)*5+y]);
						board.rectangles[(x+1)*5+y].pathNode.par = list[i];
						localhavePath = true;
					}
				}
				//Top
				if (list[i].indexY > 0) {
					if (board.rectangles[x*5+y-1].pathNode.countPath == -1 && !board.rectangles[x*5+y-1].object){
						board.rectangles[x*5+y-1].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
						newList.push(board.rectangles[x*5+y-1]);
						board.rectangles[x*5+y-1].pathNode.par = list[i];
						localhavePath = true;
					}
				}
				//Bottom
				if (list[i].indexY < 4) {
					if (board.rectangles[x*5+y+1].pathNode.countPath == -1 && !board.rectangles[x*5+y+1].object){
						board.rectangles[x*5+y+1].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
						newList.push(board.rectangles[x*5+y+1]);
						board.rectangles[x*5+y+1].pathNode.par = list[i];
						localhavePath = true;
					}
				}
			
				//Left
				if (list[i].indexX > 0) {
					if (board.rectangles[(x-1)*5+y].pathNode.countPath == -1 && !board.rectangles[(x-1)*5+y].object){
						board.rectangles[(x-1)*5+y].pathNode.countPath = board.rectangles[x*5+y].pathNode.countPath + 1;
						newList.push(board.rectangles[(x-1)*5+y]);
						board.rectangles[(x-1)*5+y].pathNode.par = list[i];
						localhavePath = true;
					}
				}
			}
			if (!localhavePath)
				return null;
		}
		
		var temp = PathFinding(0,0,newList);
		
		if (!temp)
			return null;
		path.push(temp.pathNode);
		
		return temp.pathNode.par;
	}
	
	// Bật/Tắt vẽ đường đi
	function EnableDrawPath(delta) {
		if (!pathController.bDrawPath) {
			pathController.bDrawPath = true;
			pathController.DrawPathCount = path.length - 1;
			CreatePath();
		}
		else{
			pathController.bDrawPath = false;
			ResetPath();
			
		}
	}
	
	// Vẽ đường đi
	function DrawPath() {
		if (pathController.bDrawPath){
			if (pathController.DrawPathCount >= 0)
			{
				if (pathController.timeDrawPathCount < 0)
				{
					if (debugNode) {
					graphics3.fillStyle(0x00ff00);
					graphics3.fillCircleShape(path[DrawPathCount].debugNodeImg);
					}
					pathController.timeDrawPathCount = pathController.timeDrawPath;
					pathController.DrawPathCount -= 1;	
				}
				else
				{
					pathController.timeDrawPathCount -= getDelta;
				}
			}
			else
			{
				graphics3.clear();
				if (debugNode) {
					for (var i = 0; i < board.rectangles.length; i++)
					{
						//graphics3.fillStyle(0xaa0000);
						//graphics3.fillCircleShape(board.rectangles[i].pathNode.debugNodeImg);
					}
				}
				pathController.DrawPathCount = path.length - 1;
			}
		}
		
	}
	
	// Sau khi tìm được đi thì bắt đầu tạo đường đi mà Creature có thể đi
	function CreatePath() {
		var points = [];
		points.push(new Phaser.Math.Vector2(spawnpoint.x + RECTWIDTH / 2, spawnpoint.y + RECTHEIGHT / 2));
		
		for (var i = path.length - 1; i >= 0; i--)
		{
			points.push(new Phaser.Math.Vector2(path[i].debugNodeImg.x,path[i].debugNodeImg.y));			
		}
		
		points.push(new Phaser.Math.Vector2(goalpoint.x + RECTWIDTH / 2, goalpoint.y + RECTHEIGHT / 2));
		
		var curve = new Phaser.Curves.Spline(points);
		
		graphics2.lineStyle(1, 0xffffff, 1);
		
		if (debugNode)
			curve.draw(graphics2, 64);
		
		pathCurves.add(curve);		
		
		bCreateFollower = true;
		bPathCreated = true;
	}
	
	// Sau khi tạo đường đi thì bắt đầu thêm Creature vào đường đi đó
	function AddFollower(scene)	{
		if (bCreateFollower)
		{		
			for (var i = 0; i < listEnemy.length; i++) { 
				if (listEnemy[i].followerCreated)
					continue;

				listEnemy[i].tween = scene.tweens.add({
					targets: listEnemy[i].follower,
					t: 1,
					//ease: 'Linear',
					duration: listEnemy[i].speed,
					yoyo: true,
					repeat: -1
				});
				listEnemy[i].followerCreated = true;
				
			}		
						
			bCreateFollower = false;
		}
	}
	
	// Kiểm tra Creature nếu đã đi đến cuối đường thì dừng lại không cho đi nữa cũng như Update cho Creature di chuyển
	
	function IsGetGoal(scene) {
		if (bPathCreated)
		{
			for (var i = 0; i < listEnemy.length; i++) { 
				
				listEnemy[i].tDelta = listEnemy[i].follower.t - listEnemy[i].tBefore;
				pathCurves.getPoint(listEnemy[i].follower.t, listEnemy[i].follower.vec);
				listEnemy[i].tBefore = listEnemy[i].follower.t;
				
				if (1 == listEnemy[i].follower.t){
					listEnemy[i].HP = 0;	
					live -= 1;
					
					if (live <= 0)
						ResetGame();
				}
			}	
			for (var i = 0; i < listEnemy2.length; i++) {
				if (listEnemy2[i].img.x >= goalpoint.x){
					listEnemy2[i].HP = 0;
					live -= 1;
					
					if (live <= 0)
						ResetGame();
				}
			}	
		}
	}
	
	function ResetGame()
	{	
		resetGold = true;
		for (var i = 0; i < listEnemy.length; i++) { 
			listEnemy[i].HP = -1;		
		}
		UpdateEnemy1();
		for (var i = 0; i < listEnemy2.length; i++) { 
			listEnemy2[i].HP = -1;	
		}
		UpdateEnemy2();
		for (var i = 0; i < board.rectangles.length; i++) {
			if (board.rectangles[i].object) {
				board.rectangles[i].object.bDisable = true;
				board.rectangles[i].object = null;
			}
		}
		//
		stopSpawn = true;
		waveControl.level = -1;
		live = 5;
		EndWave();
	}
	
	// Xóa đường đi hiện tại để tìm đường đi mới
	function ResetPath()
	{
		for (var i = 0; i < board.rectangles.length; i++)
		{
			if (debugNode) {
			graphics2.fillStyle(0xaa0000);
			graphics2.fillCircleShape(board.rectangles[i].pathNode.debugNodeImg);
			}
			board.rectangles[i].pathNode.countPath = -1;
			board.rectangles[i].pathNode.par = null;
		}
		board.rectangles[2].pathNode.countPath = 0;
		pathCurves.destroy();
		path = [];
		bPathCreated = false;
		pathController.DrawPathCount = -1;
	}
	
	// Vẽ Board và kiểm tra các vị trí có thể xây dựng được
	function UpdateBoard(point) {
		if (board == null)
		{
			return;
		}
		
		graphics.lineStyle(2, 0x0000aa);
	
		for(var i = 0; i < board.rectangles.length; i++)
		{
			graphics.strokeRectShape(board.rectangles[i].rectangle);
		}
	
		if (!board.bBuilding)
		{
			return;
		}
		
		var bContain = false;
		for(var i = 0; i < board.rectangles.length; i++)
		{
			 if(Phaser.Geom.Rectangle.ContainsPoint(board.rectangles[i].rectangle, point))
			 {
				 bContain = true;
				 board.buildingTemplate.x = board.rectangles[i].rectangle.x;
				 board.buildingTemplate.y = board.rectangles[i].rectangle.y;
				 board.index = i;
				 if (board.rectangles[i].object == null)
				 {
					 graphics.fillStyle(0x00aa00);
					 board.bCanBuild = true;
					 graphics.fillRectShape(board.buildingTemplate);
					 break;
				 }
				 else
				 {
						graphics.fillStyle(0xaa0000);
				 }
				 graphics.fillRectShape(board.buildingTemplate);
				 bCanBuild = false;
			 }
		}	
		if (!bContain)
		{
			board.bCanBuild = false;
		}
		bContain = false;
	}
	
	// Khi nhấn vào Board sẽ trả về ô đã được nhấn
	function GetRectOnTap(point)
	{
		for(var i = 0; i < board.rectangles.length; i++)
		{
			 if(Phaser.Geom.Rectangle.ContainsPoint(board.rectangles[i].rectangle, point))
			 {
				return board.rectangles[i];
			 }
		}	
		
		return null;
	}
	
	//====================================================================//
	
	//=================================BuildTower==============================//
	
	function BuildTower(x,y, scene){
		
		if (board.rectangles[board.index].object)
			return null;
		
		var tempTower =  new Tower1();
		board.rectangles[board.index].object = tempTower;
		
		bHavePath = false;
		var tempList = [];
		PathFinding(0,2, tempList);	
		pathController.bDrawPath = false;
		EnableDrawPath();
		EnableDrawPath();
		
		board.rectangles[board.index].object = null;
		
		var tower;
		if (!bHavePath)
		{
			return null;
		}
		
		
		
		switch (buildTowerID) {
		case 0:
			tower = new Tower1();
			tower.gold = 3;
			if (tower.gold > gold)
				return null;
			gold -= tower.gold;
			tower.id = 0;
			tower._tower = new Phaser.Geom.Rectangle(x + RECTWIDTH / 4 + RECTWIDTH / 16, y + RECTHEIGHT / 4, (RECTWIDTH - RECTWIDTH/4) / 2, RECTHEIGHT / 2);	
			tower.fireRate = 1.0;
			tower.fireRateCount = 0;
			tower.range = 100;
			tower._rangeImg = new Phaser.Geom.Circle(x + RECTWIDTH / 2, y + RECTHEIGHT / 2,tower.range);
			tower.target = null;
			tower.dmg = 3;
			tower.level = 0;
			tower.color = 0xff84e5;
		
			listTower.push(tower);
		break;
		case 1:
			tower = new Tower2();
			tower.gold = 5;
			if (tower.gold > gold)
				return null;
			gold -= tower.gold;
			
			tower.id = 1;
			tower._tower = new Phaser.Geom.Rectangle(x + RECTWIDTH / 4 + RECTWIDTH / 16, y + RECTHEIGHT / 4, (RECTWIDTH - RECTWIDTH/4) / 2, RECTHEIGHT / 2);
			tower.range = 100;
			tower._rangeImg = new Phaser.Geom.Circle(x + RECTWIDTH / 2, y + RECTHEIGHT / 2,tower.range);
			tower.target = null;
			tower.dmg = 0.7;
			tower.level = 0;
			tower.color = 0x0affe6;
		
			listTower2.push(tower);
		break;
		case 2:
			tower = new Tower1();
			tower.gold = 7;
			if (tower.gold > gold)
				return null;
			gold -= tower.gold;
			tower.id = 2;
			tower._tower = new Phaser.Geom.Rectangle(x + RECTWIDTH / 4 + RECTWIDTH / 16, y + RECTHEIGHT / 4, (RECTWIDTH - RECTWIDTH/4) / 2, RECTHEIGHT / 2);
			tower.fireRate = 2.0;
			tower.fireRateCount = 0;
			tower.range = 100;
			tower._rangeImg = new Phaser.Geom.Circle(x + RECTWIDTH / 2, y + RECTHEIGHT / 2,tower.range);
			tower.target = null;
			tower.dmg = 20;
			tower.level = 0;
			tower.color = 0xffdd8e;
			
			listTower3.push(tower);
		break;
		}
		tower._rangeImg.setEmpty();
		return tower;
	}
	
	function UpgradeTower(id, target) {
		switch (id) {
		case 0:
		if (target.level == 1) {
			if (gold < 50)
				break;
			gold -= 50;
			
			target.level++;
			target.dmg = 24;
			target.color = 0x7a0061;
		}
		
		if (target.level == 0) {
			if (gold < 5)
				break;
			gold -= 5;
			
			target.level++;
			
			target.color = 0xba0094;
			target.fireRate = 0.4;
			target.dmg = 4;
		}
			break;
		case 1:
		if (target.level == 0) {
			if (gold < 100)
				break;
			gold -= 100;
			
			target.level++;
			
			target.color = 0x1900ff;
			target.dmg = 0.3;
		}
			break;
		case 2:
		if (target.level == 0) {
			if (gold < 40)
				break;
			gold -= 40;
			
			target.level++;
			
			target.color = 0xf9af02;
			target.dmg = 100;
		}
			break;
		}
	}
	
//==========Tower1==========//
	function Tower1 () {
		var _tower;
		var _rangeImg;
		var range;
		var fireRate;
		var fireRateCount;
		var bDisable = false;
		var node;
		var target;
		var dmg;
		var level;
		var color;
		var id;
		var gold;
	}
	
	function Tower1Fire(tower, target, scene)
	{
		if (tower.fireRateCount < 0)
		{
			CreateBullet1(tower,target,scene);
			tower.fireRateCount = tower.fireRate;
		}
	}
	
	function UpdateTower1(scene)
	{
		for (var i = 0; i < listTower.length; i++)
		{
			if (listTower[i].bDisable)
				continue;
			graphics.fillStyle(rangeColor, rangeAlpha);
			graphics.fillCircleShape(listTower[i]._rangeImg);
			
			graphics.fillStyle(listTower[i].color);
			graphics.fillRectShape(listTower[i]._tower);
			
			if (listTower[i].fireRateCount >= 0)
				listTower[i].fireRateCount -= getDelta;
			//Tower 1 Attack Mechanic
			//Phaser.Math.Distance.Between(listEnemy[i].img.x,listEnemy[i].img.y, listTower[i]._tower.x,listTower[i]._tower.y)
			
			for (var ie = 0; ie < listEnemy.length; ie++) {
				if (Phaser.Math.Distance.Between(listEnemy[ie].img.x,listEnemy[ie].img.y, listTower[i]._tower.x,listTower[i]._tower.y) < listTower[i].range)
				{
					Tower1Fire(listTower[i], listEnemy[ie], scene);
					if (listTower[i].level != 2)
						break;
				}
			}	
			
			for (var ie = 0; ie < listEnemy2.length; ie++) {
				if (Phaser.Math.Distance.Between(listEnemy2[ie].img.x,listEnemy2[ie].img.y, listTower[i]._tower.x,listTower[i]._tower.y) < listTower[i].range)
				{
				if (listTower[i].level == 2)
						break;
					Tower1Fire(listTower[i], listEnemy2[ie], scene);
				}
			}	
			
		}
	}
	
	function Bullet1() {
		var img ;
		var speed;
		var dmg;
		var bDisable;
		var target;
	}
	
	function CreateBullet1(firer,target,scene)
	{
		for (var i = 0; i < listBullet1.length; i++)
		{
			if (listBullet1.bDisable)
			{
				listBullet1[i].img = scene.physics.add.image(firer._tower.x + (RECTWIDTH - RECTWIDTH/4) / 4,firer._tower.y + (RECTHEIGHT / 4), 'bullet1');
				listBullet1[i].img.x = firer._tower.x + (RECTWIDTH - RECTWIDTH/4) / 4;
				listBullet1[i].img.y = firer._tower.y + (RECTHEIGHT / 4);
				listBullet1[i].bDisable = false;
				listBullet1[i].target = target;
				return listBullet1[i];
			}
		}
		
		var bullet = new Bullet1();
		bullet.img = scene.physics.add.image(firer._tower.x + (RECTWIDTH - RECTWIDTH/4) / 4,firer._tower.y + (RECTHEIGHT / 4), 'bullet1');
		bullet.speed = 200;
		bullet.dmg = firer.dmg;
		bullet.bDisable = false;
		bullet.target = target;
		
		listBullet1.push(bullet);
	}
	
	function UpdateBullet1(scene)
	{
		for (var i = 0; i < listBullet1.length; i++)
		{
			
			if (!listBullet1[i].bDisable)
			{
				if (listBullet1[i].target.disable) {
					listBullet1[i].bDisable = true;
					listBullet1[i].img.destroy();
				}
				
				if (listBullet1[i].target.img)
					scene.physics.moveToObject(listBullet1[i].img, listBullet1[i].target.img, listBullet1[i].speed);
				
				var collider = scene.physics.add.overlap(listBullet1[i].img, listBullet1[i].target.img, function (clownOnBlock)
				{
					i--;
					listBullet1[i].bDisable = true;
					listBullet1[i].img.destroy();
					
					listBullet1[i].target.HP -= listBullet1[i].dmg;
			
					scene.physics.world.removeCollider(collider);
				}, null, scene);
			}
		}
		
		
	}
	
	//==========================//
	//==========Tower2==========//
	
	function Tower2() {
		var _tower;
		var _rangeImg;
		var range;
		var bDisable = false;
		var node;
		var target;
		var dmg;
		var level;
		var id;
		var color;
		var gold;
	}
	
	function UpdateTower2(scene)
	{
		for (var ie = 0; ie < listEnemy.length; ie++) {
				listEnemy[ie].tween.timeScale = 1;
			}
			
		for (var ie = 0; ie < listEnemy2.length; ie++) {
			listEnemy2[ie].speed = listEnemy2[ie].maxSpeed;
		}
		
		for (var i = 0; i < listTower2.length; i++)
		{
			if (listTower2[i].bDisable)
				continue;
			graphics.fillStyle(rangeColor, rangeAlpha);
			graphics.fillCircleShape(listTower2[i]._rangeImg);
			
			graphics.fillStyle(listTower2[i].color);
			graphics.fillRectShape(listTower2[i]._tower);
			
			//Tower 1 Attack Mechanic
			//Phaser.Math.Distance.Between(listEnemy[i].img.x,listEnemy[i].img.y, listTower[i]._tower.x,listTower[i]._tower.y)
			
					
			for (var ie = 0; ie < listEnemy.length; ie++) {
				if (Phaser.Math.Distance.Between(listEnemy[ie].img.x,listEnemy[ie].img.y, listTower2[i]._tower.x,listTower2[i]._tower.y) < listTower2[i].range)
				{
					listEnemy[ie].tween.timeScale = listTower2[i].dmg;
				}
			}	
			
			for (var ie = 0; ie < listEnemy2.length; ie++) {
				listEnemy2[ie].speed = listEnemy2[ie].maxSpeed;
				if (Phaser.Math.Distance.Between(listEnemy2[ie].img.x,listEnemy2[ie].img.y, listTower2[i]._tower.x,listTower2[i]._tower.y) < listTower2[i].range)
				{
					listEnemy2[ie].speed *= listTower2[i].dmg;
				}
			}	
			
			
			
		}
	}
	
	//==========================//
	//==========Tower3==========//
	function Tower3 () {
		var _tower;
		var _rangeImg;
		var range;
		var fireRate;
		var fireRateCount;
		var bDisable = false;
		var node;
		var target;
		var dmg;
		var level;
		var color;
		var id;
		var gold;
	}
	
	function Tower3Fire(tower, target, scene)
	{
		tower.fireRateCount -= getDelta;
		if (tower.fireRateCount < 0)
		{
			CreateBullet1(tower,target,scene);
			tower.fireRateCount = tower.fireRate;
		}
	}
	
	function UpdateTower3(scene)
	{
		for (var i = 0; i < listTower3.length; i++)
		{
			if (listTower3[i].bDisable)
				continue;
			graphics.fillStyle(rangeColor, rangeAlpha);
			graphics.fillCircleShape(listTower3[i]._rangeImg);
			
			graphics.fillStyle(listTower3[i].color);
			graphics.fillRectShape(listTower3[i]._tower);
			
			
			if (listTower3[i].fireRateCount >= 0)
				listTower3[i].fireRateCount -= getDelta;
			
			for (var ie = 0; ie < listEnemy2.length; ie++) {
				if (Phaser.Math.Distance.Between(listEnemy2[ie].img.x,listEnemy2[ie].img.y, listTower3[i]._tower.x,listTower3[i]._tower.y) < listTower3[i].range)
				{
					Tower1Fire(listTower3[i], listEnemy2[ie], scene);
					
					
					if (listTower3[i].level != 2)
						break;
				}
			}	
			
		}
	}
	
	//==========================//
	function CheckOverLapRectSprite(rect1, sprite)
	{
		var tempRect = new Phaser.Geom.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
		
		if (Phaser.Geom.Rectangle.Overlaps(rect1, tempRect))
			return true;
		return false;
	}
	
	//==========================================================================//
	
	//=================================Enemy==============================//
	function EnemySpawnPointInit() {
		spawnpoint = new Phaser.Geom.Rectangle(0, 2 * RECTHEIGHT , RECTWIDTH, RECTHEIGHT);
		graphics2.lineStyle(2, 0xaa0000);
		graphics2.strokeRectShape(spawnpoint);
	}
	
	function EnemyGoalPointInit() {
		goalpoint = new Phaser.Geom.Rectangle(9 * RECTWIDTH, 2 * RECTHEIGHT , RECTWIDTH, RECTHEIGHT);
		graphics2.lineStyle(2, 0xaa0000);
		graphics2.strokeRectShape(goalpoint);
	}
	
	//==========Enemy1==========//
	function Enemy1()
	{
		var img;		
		var maxSpeed;
		var speed;
		var follower;
		var followerCreated;
		var disable;
		var HP;
		var tDelta;				//Hỗ trợ tính vấn tốc theo phân trăm quảng đường đi được trên toàn bộ quảng đường
		var tBefore;
		var tween;
		var gold;
	}
	
	function CreateEnemy1(scene, type)
	{
		
		var enemy = new Enemy1();
		
		switch (type){
			case 0:
				enemy.HP = 15;
				enemy.gold = 1;
				enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy1');
			break;
			case 2:
				enemy.HP = 100;
				enemy.gold = 10;
				enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy12');
			break;
			case 3:
				enemy.HP = 1000;
				enemy.gold = 100;
				enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy13');
			break;
		}
		
		//enemy.img = new Phaser.Geom.Circle(spawnpoint.x + RECTWIDTH / 2, spawnpoint.y + RECTHEIGHT / 2, 10);
		
		enemy.follower = { t: 0, vec: new Phaser.Math.Vector2() };
		enemy.followerCreated = false;
		enemy.disable = false;
		
		//enemy.HP = 5;
		enemy.maxSpeed = 12000; 					//Càng lớn càng chậm
		enemy.speed = enemy.maxSpeed;
		enemy.tDelta = 0;
		enemy.tBefore = 0;
		
		
		listEnemy.push(enemy);
	}
	
	function UpdateEnemy1()
	{
		for (var i = 0; i < listEnemy.length; i++)
		{
			listEnemy[i].img.x = listEnemy[i].follower.vec.x;
			listEnemy[i].img.y = listEnemy[i].follower.vec.y;
			graphics.fillStyle(0xaa0000);
			graphics.fillCircleShape(listEnemy[i].img);
			
			if (listEnemy[i].HP <= 0){
				listEnemy[i].disable = true;
				gold += listEnemy[i].gold;
				listEnemy[i].img.destroy();
				waveControl.creatureDeath += 1;
			}
		}
		
		var index = -1;
		for (var i = 0; i < listEnemy.length; i++)
		{
			if (listEnemy[i].disable){
				index = i;
				break;
			}
		}
		
		if (index >=0 )
		{
			listEnemy.splice(index,1);
		}
	}
	//==========================//
	//==========Enemy2==========//
	function Enemy2()
	{
		var img;		
		var maxSpeed;
		var speed;
		var follower;
		var followerCreated;
		var disable;
		var HP;
		var tDelta;				//Hỗ trợ tính vấn tốc theo phân trăm quảng đường đi được trên toàn bộ quảng đường
		var tBefore;
		var tween;
		var gold;
	}
	
	function CreateEnemy2(scene, type)
	{
		var enemy = new Enemy2();
		switch (type)
		{
			case 1:
			enemy.HP = 10;
			enemy.gold = 4;
			enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy2');
			break;
			case 4:
			enemy.HP = 70;
			enemy.gold = 16;
			enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy22');
			break;
			case 5:
			enemy.img = scene.physics.add.image(spawnpoint.x + RECTWIDTH / 2,spawnpoint.y + RECTHEIGHT / 2, 'enemy23');
			enemy.HP = 600;
			enemy.gold = 100
			break;
		}
		
		
		//enemy.img = new Phaser.Geom.Circle(spawnpoint.x + RECTWIDTH / 2, spawnpoint.y + RECTHEIGHT / 2, 10);
		
		enemy.disable = false;
		
		//enemy.HP = 5;
		enemy.maxSpeed = 1.5;
		enemy.speed = enemy.maxSpeed;
		
		listEnemy2.push(enemy);
	}
	
	function UpdateEnemy2()
	{	
		for (var i = 0; i < listEnemy2.length; i++)
		{	
			listEnemy2[i].img.x += listEnemy2[i].speed;
			
			if (listEnemy2[i].HP <= 0){
				listEnemy2[i].disable = true;
				listEnemy2[i].img.destroy();
				waveControl.creatureDeath += 1;
				gold += listEnemy2[i].gold;
			}
			
		}
		var index = -1;
		for (var i = 0; i < listEnemy2.length; i++)
		{
			if (listEnemy2[i].disable){
				index = i;
				break;
			}
		}
		
		if (index >=0 )
		{
			listEnemy2.splice(index,1);
		}
	}
	//====================================================================//
	
	//==================================UI================================//
	// 2 Button khi nhấn vào tower hiện ra, 1 là Sale Tower và còn lại là Upgrade Tower
	
	// Chứa 2 thông tin: địa chỉ của Button (hình có thể nhấn được) và địa chỉ của Tower mà Button đang tác dụng lên
	function TowerButton()
	{
		var _button;
		var _object;
	}
	 
	// Thực hiện hiển thị 2 button khi nhấn lên Tower. Không hiển thị 2 button khi đang xây dựng, đang có Button xuất hiện, khi đang trong Wave
	function TapOnTower(pointer) {
		if (board.bBuilding || bModifingTower || !waveControl.bEndWave)
			return;
		if (pointer.upTime - pointer.downTime > 100)
		{
			var rect = GetRectOnTap(pointer);
			if (!rect)
				 return;
			
			bModifingTower = true;
			 
			if (!rect.object)
			{
				bModifingTower = false;
			}
			else
			{	
				saleButton._button.x = rect.rectangle.x + 50 + RECTWIDTH / 2;
				saleButton._button.y = rect.rectangle.y + RECTHEIGHT / 2;
				saleButton._object = rect;
				saleButton._button.visible = true;
				
				upgradeButton._button.x = rect.rectangle.x - 50 + RECTWIDTH / 2;
				upgradeButton._button.y = rect.rectangle.y + RECTHEIGHT / 2;
				upgradeButton._object = rect;
				upgradeButton._button.visible = true;
				
				rect.object._rangeImg = new Phaser.Geom.Circle(rect.rectangle.x + RECTWIDTH / 2, rect.rectangle.y + RECTHEIGHT / 2,rect.object.range);
			}
		}
	}
	
	// Ẩn 2 Button đi khi không còn thay đổi tower
	function HiddenTowerButton() {
		if (bModifingTower)
			bModifingTower = false;
		saleButton._object.object._rangeImg.setEmpty();
		saleButton._button.visible = false;
		upgradeButton._button.visible = false;
		
		
	}
	
	// Kiểm tra khi nhấn mà không nhấn vào Button để ẳn Button
	function CheckTapOutTowerModButton(pointer) {
		if (bModifingTower)
			if (!bTapOnTowerButton)
			{
				bModifingTower = false;
				HiddenTowerButton();
			}
			else
			{
				bTapOnTowerButton = false;
			}
	}
	
	function DisplayRange(pointer) {
		if (pointer.upTime - pointer.downTime > 100)
		{
			var rect = GetRectOnTap(pointer);
			if (!rect)
				 return;
			if (!rect.object) 
				return;
			else {
				rect.object._rangeImg = new Phaser.Geom.Circle(rect.rectangle.x + RECTWIDTH / 2, rect.rectangle.x + RECTHEIGHT / 2,rect.object.range);
			}
		}
	}
	//====================================================================//
	
	//==========================Spawner & Waves ==========================//
	// Tạo Creature và Các Wave tấn công
	
	// Chứa thông tin cần thiết để tạo Creature
	function Spawner() {
		var type;					//Loai Creature
		var amount;					//So luong	
		var startTime;				//Thoi gian bat dau Spawn sau khi wave bat dau
		var interval;				//Thoi gian giua cac lan Spawn
		var intervalCount;
	}
	
	// Tạo Creature bằng bốn thông tin: [Loại Creature], [Số lượng], [Thời gian bắt đầu tạo kể từ khi bắt đầu wave], [Khoảng Thời gian giữa các lần tạo Creature]ư
	function SpawnCreature (type, amount, startTime, intervalTime) {
		var sp = new Spawner();
		sp.type = type;
		sp.amount = amount;
		sp.interval = intervalTime;
		sp.intervalCount = 0;
		
		//Sau khi có được thông tin thì đưa vào mảng chờ thực hiện việc tạo Creature
		spawnList.push(sp);
	}
	
	// Hàm thực hiện Tạo Creature sau khi có thông tin tạo từ SpawnCreature
	function Spawning(scene) {
		
		if (stopSpawn) {
			stopSpawn = false;
			spawnList.splice(0, spawnList.length);
		}
		
		for (var i = 0; i < spawnList.length; i++) {
			
			//Kiểm tra nếu tạo hết số lượng Creature rồi thì không tạo nữa
			if (spawnList[i].amount <= 0)
				continue;
			
			spawnList[i].startTime -= getDelta;
			if (spawnList[i].startTime > 0)
				continue;
			
			spawnList[i].intervalCount -= getDelta;
			
			if (spawnList[i].intervalCount > 0)
				continue;
			
			spawnList[i].intervalCount = spawnList[i].interval;
			spawnList[i].amount -=1;
			
			switch(spawnList[i].type)
			{
				case 0:					
					CreateEnemy1(scene, 0);
				break;					
				case 2:
					CreateEnemy1(scene, 2);
				break;
				case 3:
					CreateEnemy1(scene, 3);
				break;
				case 1:
					CreateEnemy2(scene , 1);
				break;
				case 4:
					CreateEnemy2(scene, 4);
				break;
				case 5:
					CreateEnemy2(scene, 5);
				break;
			}
			
			bCreateFollower = true;
			
		}
	}
	
	// Các thông tin cần thiết để tạo các Wave tấn công
	function Waves (){
		var level;					// Level 
	
		var img;					// Button bắt đầu Wave kế tiếp =))
		var bEndWave;				// Game đang trong trạng thái chờ đến Wave kế tiếp (cho phép xây dựng) hay đang trong Wave
		
		var creatureDeath;			// Kiểm tra số lượng Creature đã chết trong Wave nếu [creatureDeath == creatureAmount] thì kết thúc Wave. Cập nhật trong hàm [Update*] của Creature
		var creatureAmount;			// Số lượng Creature trong Wave được cập nhật trong [StartWave]
	}
	
	// Khởi tạo các giá trị của Waves
	function CreateWave(scene) {
		waveControl = new Waves();
		waveControl.level = 0;
		waveControl.bEndWave = true;
		waveControl.img = scene.add.sprite(50, 6 * RECTHEIGHT + RECTHEIGHT/4, 'startWaveButton').setInteractive();
		waveControl.img.visible = true;
		waveControl.creatureDeath = 0;
		waveControl.creatureAmount = 0;
		
		waveControl.img.on('pointerup', function(pointer){
			StartWave();
		});
	}
	
	// Bắt đầu Wave tấn công, Gọi khi hết thời gian chờ hoặc nhấn vào Button [Start]
	// Thực hiện việc không cho phép xây dựng, Tìm và vẽ đường đi cho Creature, Tạo Creature, Thiết kế Wave, ẩn Button [Start](waves.img)
	function StartWave() {
		waveControl.bEndWave = false;
		waveControl.img.visible = false;
		
		// Tìm và Tạo đường đi cho Creature
		var tempList = [];
		PathFinding(0,2, tempList);	
		EnableDrawPath();
		
		// Thiết lập Level cần có gì
		switch (waveControl.level)
		{
			case 0:
				waveControl.creatureAmount = 2;
				SpawnCreature(0,2,1,1);	
								
				break;
			case 1:
				waveControl.creatureAmount = 6;
				SpawnCreature(0,6,1,1.5);	
				break;
			case 2:
				waveControl.creatureAmount = 9;
				SpawnCreature(0,8,1,1);
				SpawnCreature(1,1,1,1);
				break;
			case 3:
				waveControl.creatureAmount = 14;
				SpawnCreature(0,9,1,1);	
				SpawnCreature(1,5,1,1.5);
				break;
			case 4:
				waveControl.creatureAmount = 1;
				SpawnCreature(2,1,1,1);	
				break;
			case 5:
				waveControl.creatureAmount = 14;
				SpawnCreature(0,10,1,0.4);	
				SpawnCreature(2,1,5.2,1);
				SpawnCreature(1,3,1,1.5);
				break;
			case 6:
				waveControl.creatureAmount = 8;
				SpawnCreature(2,6,1,1);	
				SpawnCreature(4,2,1,1.5);
				break;
			case 7:
				waveControl.creatureAmount = 35;
				SpawnCreature(0,20,1,0.6);	
				SpawnCreature(2,10,1.5,1);	
				SpawnCreature(4,5,1,1);
				break;
			case 8:
				waveControl.creatureAmount = 26;
				SpawnCreature(2,20,1,0.5);	
				SpawnCreature(4,6,1,1);
				break;
			case 9:
				waveControl.creatureAmount = 2;
				SpawnCreature(3,1,1,1);	
				SpawnCreature(5,1,2,1);
				break;
			default:
				waveControl.creatureAmount = 0;
				debugText.setText(waveControl.level);
				break;
		}
		
	}
	
	// Kết thúc Wave, Gọi khi [creatureDeath == creatureAmount]
	// Thực hiện việc tăng Level, bật hiển thị Button [Start](waves.img), Reset Thời gian chờ wave kế và bắt đầu đếm, Reset creatureDeath, Xóa đường đi cũ của Creature
	function EndWave() {
		waveControl.level++;
		waveControl.bEndWave = true;
		waveControl.img.visible = true;
		waveControl.creatureDeath = 0;
		EnableDrawPath();
	}
	
	// Thực hiện việc đếm thời gian chờ và Gọi [EndWave]
	function WavesUpdate() {
		if (waveControl.creatureAmount <= waveControl.creatureDeath && !waveControl.bEndWave)
			EndWave();
	}
	
	//====================================================================//
	
	 function resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }    
	
	//=================================Main===============================//
	
    function preload() {
		this.load.image('button1', 'img/button1.png');
		this.load.image('button2', 'img/button2.png');
		this.load.image('button3', 'img/button3.png');
		this.load.image('sale', 'img/Sale.png');
		this.load.image('upgrade', 'img/Upgrade.png');
		this.load.image('debugDrawPath1', 'img/DebugDrawPath1.png');
		this.load.image('debugDrawPath2', 'img/DebugDrawPath2.png');
		this.load.image('bullet1', 'img/Bullet1.png');
		this.load.image('enemy1', 'img/Enemy11.png');
		this.load.image('enemy12', 'img/Enemy12.png');
		this.load.image('enemy13', 'img/Enemy13.png');
		this.load.image('enemy2', 'img/Enemy21.png');
		this.load.image('enemy22', 'img/Enemy22.png');
		this.load.image('enemy23', 'img/Enemy23.png');
		this.load.image('startWaveButton', 'img/StartWaveButton.png');
		this.load.image('restartGame', 'img/RestartGame.png');
    }
    
    function create() {
		window.addEventListener('resize', resize);
        resize();
		
		graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aa00 } });
		graphics2 = this.add.graphics({ lineStyle: { width: 2, color: 0x00aa00 } });
		graphics2.clear();
		graphics3 = this.add.graphics({ lineStyle: { width: 2, color: 0x00aa00 } });
		graphics3.clear();
		
		debugText = this.add.text(10,180);
		debugText2 = this.add.text(50,292);
		
		goldText = this.add.text (10,20);
		goldDisplay = this.add.text (20,40);
		goldText.setText("Gold: ");
		liveText = this.add.text (585,20);
		liveDisplay = this.add.text (595,40);
		liveText.setText("Live: ");
		
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		
		this.input.mouse.disableContextMenu();
		this.input.setPollAlways();
		
		board = CreateBoard(graphics);
		pathController = new PathController();
		
		pathCurves = this.add.path();
		
		
		
		//=================================UI==============================//
		///////////
		//Tap Controller//
		// Tạo các Button trong Game và điều khiển việc xây dựng trong Game thông qua Input
		//TapUp
		this.input.on('pointerup', function (pointer) {
			if (pointer.rightButtonDown())
			{
				//Building
				if (board.bBuilding)
				{
					board.bBuilding = false;
				}
			}
			else
			{
				//Building
				if (board.bBuilding)
				{
					if (!board.bCanBuild && board.bStartBuild)
					{
						board.bBuilding = false;
						board.bStartBuild = false;		
						button1.clearTint();
						buttonTower2.clearTint();
					}
					else if (board.bCanBuild)
					{	
						board.bBuilding = false;
						board.bStartBuild = false;
						board.bCanBuild = false;
						var tower = BuildTower(board.buildingTemplate.x,board.buildingTemplate.y, this);
						button1.clearTint();
						buttonTower2.clearTint();
						buttonTower3.clearTint();
						
						if (tower) {
							board.rectangles[board.index].object = tower;
							tower.node = board.rectangles[board.index];
						}
					}
					else
						board.bStartBuild = true;
				}
				///////////
				
				//Control UI	
				CheckTapOutTowerModButton(pointer);
					
				TapOnTower(pointer);
				
				bTapping = false;
				///////////
			}
		}, this);	
		
		//TapDown
		this.input.on('pointerdown', function (pointer) {
			if (!pointer.rightButtonDown())
			{
				//Control UI
				bTapping = true;
			}

		}, this);
		///////////////////	
		//Button//
		//Tower 1
		button1 = this.add.sprite(490, 6 * RECTHEIGHT + RECTHEIGHT/4, 'button1', 'button1.png').setInteractive();
		var infoT11 = this.add.text(540, 6 * RECTHEIGHT - RECTHEIGHT/4 - 10);
		infoT11.setText("Buy: 3");
		var infoT12 = this.add.text(540, 6 * RECTHEIGHT);
		infoT12.setText("Up1: 5");
		var infoT13 = this.add.text(540, 6 * RECTHEIGHT + RECTHEIGHT/4 + 10);
		infoT13.setText("Up2: 100");
		
		button1.on('pointerdown', function (pointer){
			this.setTint(0x00ff00);
		});
		
		button1.on('pointerout', function(pointer){
			//if (!board.bBuilding)
				//this.clearTint();
		});
		
		button1.on('pointerup', function(pointer){
			this.clearTint();
			if (bModifingTower)
				return;
			if (waveControl.bEndWave) { 
				board.bBuilding = true;
				buildTowerID = 0;
				this.setTint(0x0000ff);
			}
		});
		
		///////////////////	
		
		//Tower 2
		buttonTower2 = this.add.sprite(320, 6 * RECTHEIGHT + RECTHEIGHT/4, 'button2').setInteractive();
		var infoT21 = this.add.text(370, 6 * RECTHEIGHT - RECTHEIGHT/4);
		infoT21.setText("Buy: 5");
		
		buttonTower2.on('pointerdown', function (pointer){
			this.setTint(0x00ff00);
		});
		
		buttonTower2.on('pointerout', function(pointer){
			if (!board.bBuilding)
				this.clearTint();
		});
		
		buttonTower2.on('pointerup', function(pointer){
			this.clearTint();
			if (bModifingTower)
				return;
			if (waveControl.bEndWave) { 
				board.bBuilding = true;
				buildTowerID = 1;
				this.setTint(0x0000ff);
			}
		});
		
		///////////////////	
		
		//Tower 3
		buttonTower3 = this.add.sprite(150, 6 * RECTHEIGHT + RECTHEIGHT/4, 'button3').setInteractive();
		
		var infoT31 = this.add.text(200, 6 * RECTHEIGHT - RECTHEIGHT/4);
		infoT31.setText("Buy: 7");
		var infoT32 = this.add.text(200, 6 * RECTHEIGHT + RECTHEIGHT/4);
		infoT32.setText("Up: 40");
		
		buttonTower3.on('pointerdown', function (pointer){
			this.setTint(0x00ff00);
		});
		
		buttonTower3.on('pointerout', function(pointer){
			if (!board.bBuilding)
				this.clearTint();
		});
		
		buttonTower3.on('pointerup', function(pointer){
			this.clearTint();
			if (bModifingTower)
				return;
			if (waveControl.bEndWave) { 
				board.bBuilding = true;
				buildTowerID = 2;
				this.setTint(0x0000ff);
			}
		});
		
		///////////////////	
		//Sale/////////////	
		saleButton = new TowerButton();
		saleButton._button = this.add.sprite(500, 420, 'sale').setInteractive();
		saleButton._button.visible = false;
		
		saleButton._button.on('pointerdown', function(pointer){
			if (bModifingTower)
			{
				bTapOnTowerButton = true;
			}
		});
		
		saleButton._button.on('pointerup', function(pointer){
			if (bModifingTower)
			{
				HiddenTowerButton();
				saleButton._object.object.bDisable = true;
				saleButton._object.object = null;				
			}
		});
		
		//////////////////////
		//Upgrade/////////////			
		upgradeButton = new TowerButton();
		upgradeButton._button = this.add.sprite(400, 420, 'upgrade').setInteractive();
		upgradeButton._button.visible = false;
		
		upgradeButton._button.on('pointerdown', function(pointer){
			if (bModifingTower)
			{
				bTapOnTowerButton = true;
			}
		});
		
		upgradeButton._button.on('pointerup', function(pointer){
			if (bModifingTower) {
				
				UpgradeTower(upgradeButton._object.object.id,upgradeButton._object.object);
				HiddenTowerButton();
				
			}
		});
		
		///////////////////	
		//RestartGame/////////////
		buttonRestartGame = this.add.sprite(610, 4 * RECTHEIGHT + RECTHEIGHT/4, 'restartGame').setInteractive();
		
		buttonRestartGame.on('pointerdown', function (pointer){
			this.setTint(0x00ff00);
		});
		
		buttonRestartGame.on('pointerout', function(pointer){
			this.clearTint();
			countRestartTap = 0;
		});
		
		buttonRestartGame.on('pointerup', function(pointer){
			if (countRestartTap == 0)
				countRestartTap = 1;
			else if (countRestartTap == 1) {
				ResetGame();
				countRestartTap = 0;
			}
		});
		
		//////////////////////
		///////////
		//Board////
		// Tạo điểm khởi đầu và kết thúc cho Creature
		EnemySpawnPointInit();
		EnemyGoalPointInit();
		//CreateEnemy1(this);
		//CreateEnemy1(this);
		
				
		///////////
		//====================================================================//
		// Khởi tạo Waves
		CreateWave(this);	
    }    
	
	// Hiển thị FramRate
	var countFrame = 0;
	var deltatimer = 0;
	
	
	function update(time, delta){
		graphics.clear();
		getDelta = delta / 1000;
		
		goldDisplay.setText(gold);
		liveDisplay.setText(live);
		
		// Hiển thị FramRate///////////
		countFrame++;
		deltatimer += delta / 1000;
		if(deltatimer >= 1)
		{
			//debugText2.setText(countFrame);
			countFrame = 0;
			deltatimer = 0;
		}

		/////////////////////////////////
	
		UpdateBoard(game.input.activePointer);
		UpdateEnemy1();
		UpdateEnemy2();
		UpdateTower1(this);
		UpdateBullet1(this);
		UpdateTower2(this);
		UpdateTower3(this);
		
		Spawning(this);
		WavesUpdate();
		
		if (countRestartTap == 1) {
			countRestartTapTime -= getDelta;
			if (countRestartTapTime <= 0) {
				countRestartTap == 0;
				countRestartTapTime = 3;
			}
		}
		
		DrawPath();
		
		if (resetGold) {
			resetGold = false;
			gold = 10;
		}
		
		AddFollower(this);
		IsGetGoal(this);

		if (keyA.isDown)
		{
			ResetGame();
		}
		
		
		
	}
});

if (!window.cordova) {
    window.dispatchEvent('deviceready');
}