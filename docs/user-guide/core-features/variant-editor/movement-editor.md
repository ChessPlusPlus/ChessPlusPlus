# Movement Editor

## How to create a movement

On the right of the screen, you should see this. Click **"Create movement"** to create your very first movement.

<figure><img src="../../../.gitbook/assets/Screenshot 2026-05-30 143847.png" alt=""><figcaption><p>Legs</p></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (2) (1).png" alt=""><figcaption></figcaption></figure>

Just **choose a name** for your new movement, and that is all.

{% hint style="info" %}
Note: No two movements can share the same name.
{% endhint %}

<figure><img src="../../../.gitbook/assets/image (16).png" alt=""><figcaption></figcaption></figure>

Upon creation, you should be seeing this on the right. Here, you can **edit the movement's name** and **configure its behaviour**.

***

## How to configure a movement

A movement has **4 important fields**:

* Allowed move types
* Move definition (vector)
* Range
* Conditions

***

### Allowed move types

There are **2** different move types that a move can have, and those are "**Movement**" and "**Capture**".

#### Functionality

* **Movement**:
  * When this is checked, the move allows a piece to change its location to **empty** [**squares**](#user-content-fn-1)[^1].
* **Capture**:
  * When this is checked, the move allows a piece to change its location to any [**square**](#user-content-fn-1)[^1] **with another piece on it**, therefore **removing the former piece and capturing it**.

{% hint style="info" %}
Note: Both "Movement" and "Capture" cannot be unchecked at the same time!
{% endhint %}

***

### Move definition (vector)

A move definition tells the piece **how and where it can move**, **relative to its current position**.&#x20;

{% hint style="info" %}
This is equivalent to a vector in physics, which is a quantity that has both a magnitude and direction.
{% endhint %}

This has **2** parameters: **X and Y**. Each parameter defines movement in the X and Y axis respectively.

<figure><img src="../../../.gitbook/assets/image (5) (1).png" alt=""><figcaption></figcaption></figure>

On the board, the X axis goes from **left to right**, while the Y axis goes from **bottom to top**.

<figure><img src="../../../.gitbook/assets/image (6) (1).png" alt=""><figcaption></figcaption></figure>

The value for each axis defines how much the piece moves in that axis.

***

### Range

The range defines how many times the move vector is **repeated**, which lets a piece travel in many tiny steps. For example, with a move vector of (1, 1) and a range of 5, a piece starting at (0, 0) will be allowed to move northeast until (5, 5).

You can either set it as a **positive non-zero integer or unlimited** (meaning it goes on forever).

***

### Conditions

Currently, there is only one condition: **Allow only on first move**. When it is checked, it makes it so that the move can only be executed when the piece has not yet moved.

{% hint style="info" %}
Note: There is already internal functionally to allow other conditions, however it is still in development and will be expanded upon very soon in the next update.
{% endhint %}

***

And that is all! Now, let us learn how to give a piece some movements.



[^1]: A square is any position in the board.
