Note: This display has [problems](https://github.com/rtek1000/2.4inch_ESP32-2432S024/blob/main/README.md#warning)

-----

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

##### If the error " 'GPIO' was not declared in this scope" occurs:
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

#### Touchscreen

Note:
- I noticed that sometimes false touches occur on the touchscreen, and this can trigger events such as screen scrolling and clicking a button. On different days, I've had a button with a MessageBox open and another situation where the screen scrolls, as if there had been more than one false touch. The CST820 IC datasheet recommends using the interrupt pin (INT), but unfortunately my display does not generate a signal on the INT pin. To try to get around this, I added a simple check of consecutive readings, and only 5 attempts to read again (so as not to cause too much delay in the rest of the display operations) see the CST820 driver files.

- I did new tests, I removed the TP-C connector on the board, being very careful not to let heat reach the display, but the connector did not survive. I made a new connection from the INT pin of the CST820 to the GPIO36 pin (where the touch interrupt is when resistive touch is used in conjunction with the XPT2046 IC), as can be seen in the diagram (U3).

- - The result was that the INT pin makes a low level interrupt (falling). But the datasheet says that the interrupt edge can be configured as high or low, so to know which one it is, just monitor the INT pin without touching the screen.


- What caught my attention is that I left the ESP32 microcontroller input as just INPUT, without PULL-UP, and even so the interruption occurs. In other words, the INT pin of the CST820 is sending a HIGH signal, but the board connects to GND (in the long term it is not possible to be sure that the CST820 IC will remain healthy).

- - Datasheet only mentions that the maximum output current (IoH) should be 2mA (when the output provides a high signal), and the datasheet cites a maximum output current (IoL) of 20mA (when the output provides low signal), but I didn't find out if it can be short-circuited with GND. Unfortunately the designer got confused and left the pin linked to GND (Perhaps that's why this display hasn't become popular).

- Another observation is about the speed of the I2C (Wire) bus, CST820 datasheet states that the IC can operate from 10kHz to 400kHz.

##### Warning

- Warning: Pin 5 of the TP-C connector was connected directly to GND, it is recommended to remove resistor R25 to avoid problems with the ESP32, especially if you want to use the I2C port present in connector P3, pin 1 (IO21). (In the long term it is not possible to be sure that the CST820 IC will remain healthy, see more details above)

![img](https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/refs/heads/main/5-Schematic/2432S024-2-V1.0_GND_ERROR.png)

![img](https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/refs/heads/main/5-Schematic/20250626_161243b.jpg)

![img](https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/refs/heads/main/5-Schematic/20250626_153901b.jpg)

-----

You can try using an adapter to connect the INT pin to an ESP32 input pin (I left it on ESP32 pin IO36, which is the pin used for the resistive touch [XPT2046, U3], and leave the I2C pins free [IO21, IO22. Connector P3]).

I found an ad that can give you a reference to the type of adapter I'm referring to: FPC-6P-0.5mm
https://www.aliexpress.com/item/1005005898190004.html

![img](https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/refs/heads/main/2-Specification/FPC-6P-0.5mm.png)

I used one of these adapters, but the one I have is 12 pin, even so, it worked. I left the adapter glued over the SD card socket, using green 3M double sided tape (code 851J).

![img](https://raw.githubusercontent.com/rtek1000/2.4inch_ESP32-2432S024/refs/heads/main/photos/Display%20PCB%20adapter.jpg)

Once the touch has an interrupt signal (on my display it occurs approximately every 37ms), the data is valid when the interrupt occurs, according to the CST820 datasheet.

Using the CST820 interrupt pin with LVGL is a little more complicated than using baremetal screen codes, although LVGL greatly speeds up screen creation.

The method I found to use the CST820 interrupt pin with LVGL was to indirectly monitor the interrupt pin and call the touch reading routine (also indirectly, since the touch reading routine in the demo code is a callback function, called by another internal LVGL function).

Sample code can be seen at: [LVGL_Arduino_Example_Int
](https://github.com/rtek1000/2.4inch_ESP32-2432S024/tree/main/1-Demo/Demo_Arduino_LVGL-v9.3.0/2.4inch_ESP32-2432S024/LVGL_Arduino_Example_Int)

- Note that using the CST820 interrupt pin (INT), it is safer to just read the data once. But if false touches occur, it may be interesting to implement some type of filter, such as successive readings, right after the interrupt.

-----

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE
