//interface script
    var menuOn = false;
    var toggleBut = $('#ToggleImg')[0];
    $('#ServersList').animate({width:'toggle'},0);  //closed by default
    //toggleTheMenu(350);
    $('#ToggleButton').click(function(){
       toggleTheMenu(350);
    });

    $('#ServersList')[0].onmousedown = function(e){
      e.stopPropagation();
    }

    $('#ToggleButton')[0].onmousedown = function(e){
      e.stopPropagation();
    }

    function toggleTheMenu(speed) {
      $('#ServersList').animate({ width: 'toggle' }, speed);
      if (!menuOn) {
        toggleBut.src = "images/CloseImage.png";
        toggleBut.width = 50;
        toggleBut.height = 45;
        menuOn = true;
      }
      else {
        toggleBut.src = "images/ToggleImage.png";
        menuOn = false;
      }
    }

    // Get the modal
    var modal = document.getElementById('myModal');

    function ShowModal(){
      modal.style.display = "block";
    }

    function HideModal(){
      modal.style.display = "none";
    }
    var joystick = new VirtualJoystick({container: $('#TotalDiv')[0]})
    joystick.addEventListener('touchStart', function(){
      console.log('down')
    })
    joystick.addEventListener('touchEnd', function(){
      console.log('up')
    })
    joystick.addEventListener('right', function(){
      console.log('right')
    })

    $('#ShootButton')[0].ontouchstart = function (e){
      if (mytank) mytank.shoot()
      e.preventDefault();
    }

    //in case of using mobile devices
    if (MODILE_DEVICE) {
      setAttr($('#DownloadRoomButton')[0],"display","none")
    }

    window.addEventListener('keyup',function(e){
      if (e.keyCode == 9) toggleTheMenu(350)
    })