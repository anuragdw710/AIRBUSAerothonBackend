class Node {
    constructor(x, y, g, h, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start to this node
        this.h = h; // Heuristic cost to goal
        this.f = g + h; // Total cost
        this.parent = parent;
    }
}

function heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // 4 directions
        [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonals
    ];

    for (const [dx, dy] of directions) {
        const x = node.x + dx;
        const y = node.y + dy;
        if (grid[x] && grid[x][y] !== undefined && grid[x][y] !== 0) {
            neighbors.push(new Node(x, y, 0, 0));
        }
    }

    return neighbors;
}

function astar(start, goal, grid) {
    const openSet = [];
    const closedSet = new Set();
    const startNode = new Node(start.x, start.y, 0, heuristic(start, goal));
    openSet.push(startNode);

    while (openSet.length > 0) {
        // Get the node with the lowest f score
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            // Reconstruct path
            const path = [];
            let temp = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse();
        }

        closedSet.add(`${current.x},${current.y}`);

        for (const neighbor of getNeighbors(current, grid)) {
            if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                continue;
            }

            const tentativeG = current.g + 1; // Assuming cost between nodes is 1

            if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, goal);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                openSet.push(neighbor);
            } else {
                const existingNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
                if (tentativeG < existingNode.g) {
                    existingNode.g = tentativeG;
                    existingNode.f = existingNode.g + existingNode.h;
                    existingNode.parent = current;
                }
            }
        }
    }

    return []; // No path found
}

async function createGridFromDatabase(cords) {
    const grid = [];

    cords.forEach((cord) => {
        if (!grid[cord.x]) {
            grid[cord.x] = [];
        }
        grid[cord.x][cord.y] = cord.reserve || cord.weather != "good" ? 0 : 1;
    });

    return grid;
}

module.exports = {
    astar,
    createGridFromDatabase
};