Intro by [NoosaHydro](https://github.com/NoosaHydro/2.4inch_ESP32-2432S024):

# 2.4inch_ESP32-2432S024

Fan site for the amazing ESP32 Dev board with a touch screen!

If you work on this board and want to share your efforts, contact me to add your projects to [this repo](https://github.com/NoosaHydro/2.4inch_ESP32-2432S024)

<img src="https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/main/photos/front.png" width=25% height=25%>

Board, shown running the as-shipped demo touchscreen firmware

<img src="https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/main/photos/back.png" width=50% height=50%>

Back, showing location and naming of pins and headers (refer Specifications PDF)

-----

-----

By RTEK1000:

### Info:
- Examples are only compatible with LVGL version 8.3.3, see file 2.4inch_ESP32-2432S024.zip (Downloads)
 (Added example for LVGL v9.3.0)

- [Added screen rotation](https://github.com/rtek1000/2.4inch_ESP32-2432S024/blob/main/1-Demo/Demo_Arduino/1_2_Factory_samples_Capacitive_touch/Factory_samples_Capacitive_touch/Factory_samples_Capacitive_touch.ino) (touch follows rotation):

<img src="https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/main/photos/Landscape.jpg" width=50% height=50%>

### If the error " 'GPIO' was not declared in this scope" occurs:
- Try including this file:
> #include "hal/gpio_ll.h" // GPIO register functions
- - Ref.: https://github.com/prenticedavid/MCUFRIEND_kbv/issues/255
 
Example (file: Demo_Arduino/libraries/TFT_eSPI/Processors/TFT_eSPI_ESP32.h):
```C++
        ////////////////////////////////////////////////////
        // TFT_eSPI driver functions for ESP32 processors //
        ////////////////////////////////////////////////////

#ifndef _TFT_eSPI_ESP32H_
#define _TFT_eSPI_ESP32H_

// Processor ID reported by getSetup()
#define PROCESSOR_ID 0x32

// Include processor specific header
#include "soc/spi_reg.h"
#include "driver/spi_master.h"
#include "hal/gpio_ll.h" // GPIO register functions
```

Note:
- For the Arduino IDE (v2) to find the libraries, in the [menu]file/preferences select "Sketchbook location":
```
2.4inch_ESP32-2432S024/1-Demo/Demo_Arduino
```
(There is already a folder called 'library' there)

- You must pay attention to the configuration files to be replaced, for example (1_2_Factory_samples_Capacitive_touch):
> 2.4inch_ESP32-2432S024/1-Demo/Demo_Arduino/1_2_Factory_samples_Capacitive_touch/TFT_eSPI bottom layer replacement file/
- - lv_conf.h
- - - It needs to be in the 'library' folder (outside the 'lvgl' folder, yes it is unusual)
- - User_Setup.h
- - - It needs to be in the 'libraries/TFT_eSPI/' folder

-----

##### Touchscreen

Note:
- I noticed that sometimes false touches occur on the touchscreen, and this can trigger events such as screen scrolling and clicking a button. On different days, I've had a button with a MessageBox open and another situation where the screen scrolls, as if there had been more than one false touch. The CST820 IC datasheet recommends using the interrupt pin (INT), but unfortunately my display does not generate a signal on the INT pin. To try to get around this, I added a simple check of consecutive readings, and only 5 attempts to read again (so as not to cause too much delay in the rest of the display operations).

- Another observation is about the speed of the I2C (Wire) bus, CST820 datasheet states that the IC can operate from 10kHz to 400kHz.
