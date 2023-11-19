import math

def sainte_lague(votes, num_seats):
    # Initialize seats for each party
    seats = {party: 0 for party in votes}

    # Calculate divisor for each party
    divisors = {party: math.sqrt(2 * i + 1) for i, party in enumerate(votes)}

    print(divisors)

    # Seat allocation process
    for _ in range(num_seats):
        quotients = {party: votes[party] / divisors[party] for party in votes}
        
        # Find the party with the highest quotient
        winning_party = max(quotients, key=quotients.get)
        
        # Increment the seat for the winning party
        seats[winning_party] += 1
        
        # Recalculate the divisor for the winning party
        divisors[winning_party] = math.sqrt(2 * seats[winning_party] + 1)

    return seats

# Example usage:
party_votes = {'CSU': 7591332, 'FW': 3249661, 'AfD': 2992675, "Grüne": 2961819, "SPD": 1693542}
allocated_seats = sainte_lague(party_votes, num_seats=160)

print("Seat Allocation:")
for party, seats in allocated_seats.items():
    print(f"{party}: {seats} seats")
